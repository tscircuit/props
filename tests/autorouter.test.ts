import { expect, spyOn, test } from "bun:test"
import {
  type AutorouterConfig,
  type ImplicitBreakoutPointSolverFn,
  type RoutingTolerances,
  autorouterConfig,
  autorouterProp,
  routingTolerances,
  subcircuitGroupPropsWithBool,
} from "../lib"

test("supports freerouting preset", () => {
  const result = autorouterProp.parse("freerouting")
  expect(result).toBe("freerouting")
})

test("supports snake_case presets", () => {
  const result = autorouterProp.parse("auto_cloud")
  expect(result).toBe("auto_cloud")
})

test("supports default preset", () => {
  const result = autorouterProp.parse("default")
  expect(result).toBe("default")

  const configResult = autorouterProp.parse({ preset: "default" })
  expect(configResult).toMatchObject({ preset: "default" })
})

test("supports auto jumper preset", () => {
  const result = autorouterProp.parse("auto_jumper")
  expect(result).toBe("auto_jumper")
})

test("supports opting in to via-in-pad routing", () => {
  const enabled: AutorouterConfig = { allowViaInPad: true }
  const disabled: AutorouterConfig = { allowViaInPad: false }

  expect(autorouterConfig.parse(enabled).allowViaInPad).toBe(true)
  expect(autorouterConfig.parse(disabled).allowViaInPad).toBe(false)
  expect(autorouterConfig.parse({}).allowViaInPad).toBeUndefined()
})

test("supports an implicit breakout point solver override", async () => {
  const implicitBreakoutPointSolverFn: ImplicitBreakoutPointSolverFn = (
    input,
  ) => ({
    breakoutPoints: input.connections.flatMap((connection) =>
      "connectionId" in connection
        ? connection.endpoints.map((endpoint) => ({
            ...endpoint.position,
            regionId: endpoint.regionId,
            connectionId: connection.connectionId,
            layer: "top",
          }))
        : [],
    ),
  })

  const result = autorouterConfig.parse({ implicitBreakoutPointSolverFn })

  expect(result.implicitBreakoutPointSolverFn).toBe(
    implicitBreakoutPointSolverFn,
  )
  expect(
    await result.implicitBreakoutPointSolverFn?.({
      regions: [
        {
          regionId: "region-1",
          bounds: { minX: 0, maxX: 10, minY: 0, maxY: 10 },
          edge: "right",
        },
      ],
      connections: [
        {
          connectionId: "connection-1",
          endpoints: [
            {
              regionId: "region-1",
              position: { x: 5, y: 5 },
              externalDestination: { x: 15, y: 5 },
            },
          ],
        },
      ],
      buses: [
        {
          busId: "bus-1",
          connectionIds: ["connection-1"],
          targetLayers: ["top", "bottom"],
        },
      ],
      boundaryPointSpacing: 0.5,
    }),
  ).toEqual({
    breakoutPoints: [
      {
        x: 5,
        y: 5,
        regionId: "region-1",
        connectionId: "connection-1",
        layer: "top",
      },
    ],
  })
})

test("supports laser prefab preset", () => {
  const result = autorouterProp.parse("laser_prefab")
  expect(result).toBe("laser_prefab")
})

test("supports tscircuit beta preset", () => {
  const result = autorouterProp.parse("tscircuit_beta")
  expect(result).toBe("tscircuit_beta")
})

test("supports krt preset", () => {
  const result = autorouterProp.parse("krt")
  expect(result).toBe("krt")
})

test("supports fanout presets", () => {
  expect(autorouterProp.parse("single_layer_fanout")).toBe(
    "single_layer_fanout",
  )
  expect(autorouterProp.parse("fanout")).toBe("fanout")
  expect(autorouterProp.parse({ preset: "fanout" })).toMatchObject({
    preset: "fanout",
  })
})

test("still supports deprecated kebab-case presets", () => {
  const result = autorouterProp.parse("auto-cloud")
  expect(result).toBe("auto-cloud")
})

test("supports shared routing tolerances", () => {
  const raw: RoutingTolerances = {
    minTraceWidth: "0.12mm",
    minViaHoleEdgeToViaHoleEdgeClearance: "0.2mm",
    minPlatedHoleDrillEdgeToDrillEdgeClearance: "0.25mm",
    minTraceToPadEdgeClearance: "0.16mm",
    minPadEdgeToPadEdgeClearance: "0.18mm",
    minBoardEdgeClearance: "0.4mm",
    minViaEdgeToPadEdgeClearance: "0.14mm",
    minViaHoleDiameter: "0.3mm",
    minViaPadDiameter: "0.6mm",
  }

  const result = routingTolerances.parse(raw)
  expect(result.minTraceWidth).toBe(0.12)
  expect(result.minViaPadDiameter).toBe(0.6)
})

test("supports pipeline-based autorouter versions", () => {
  const autorouterVersions = [
    "beta_pipeline1",
    "beta_pipeline3",
    "beta_pipeline4",
    "beta_pipeline5",
    "beta_pipeline7",
    "beta_pipeline9",
    "latest",
  ] as const

  for (const autorouterVersion of autorouterVersions) {
    const result = subcircuitGroupPropsWithBool.parse({
      subcircuit: true,
      autorouterVersion,
    })
    expect(result.autorouterVersion).toBe(autorouterVersion)
  }
})

test("warns and falls back to latest for unknown autorouter versions", () => {
  const consoleWarn = spyOn(console, "warn").mockImplementation(() => {})

  try {
    for (const autorouterVersion of ["v1", "v6", "beta_pipeline999"]) {
      const result = subcircuitGroupPropsWithBool.parse({
        subcircuit: true,
        autorouterVersion,
      })
      expect(result.autorouterVersion).toBe("latest")
      expect(consoleWarn).toHaveBeenCalledWith(
        `Unknown autorouterVersion "${autorouterVersion}", falling back to "latest".`,
      )
    }
  } finally {
    consoleWarn.mockRestore()
  }
})
