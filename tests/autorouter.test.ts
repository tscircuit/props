import { expect, test } from "bun:test"
import {
  autorouterConfig,
  autorouterProp,
  routingTolerances,
  subcircuitGroupPropsWithBool,
  type AutorouterConfig,
  type RoutingTolerances,
} from "../lib/components/group"

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

test("rejects v-prefixed autorouter versions", () => {
  for (const autorouterVersion of ["v1", "v2", "v3", "v4", "v5", "v6"]) {
    const result = subcircuitGroupPropsWithBool.safeParse({
      subcircuit: true,
      autorouterVersion,
    })
    expect(result.success).toBe(false)
  }
})
