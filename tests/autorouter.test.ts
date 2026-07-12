import { expect, test } from "bun:test"
import {
  autorouterProp,
  routingTolerances,
  subcircuitGroupPropsWithBool,
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

test("supports cache server settings", () => {
  const result = autorouterProp.parse({
    cacheServerUrl: "https://cache.example.com/autorouting",
    shouldUploadToCache: true,
  })

  expect(result).toMatchObject({
    cacheServerUrl: "https://cache.example.com/autorouting",
    shouldUploadToCache: true,
  })
})

test("supports auto jumper preset", () => {
  const result = autorouterProp.parse("auto_jumper")
  expect(result).toBe("auto_jumper")
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

test("supports autorouter version v4", () => {
  const result = subcircuitGroupPropsWithBool.parse({
    subcircuit: true,
    autorouterVersion: "v4",
  })
  expect(result.autorouterVersion).toBe("v4")
})

test("supports autorouter version v5", () => {
  const result = subcircuitGroupPropsWithBool.parse({
    subcircuit: true,
    autorouterVersion: "v5",
  })
  expect(result.autorouterVersion).toBe("v5")
})

test("supports autorouter version v6", () => {
  const result = subcircuitGroupPropsWithBool.parse({
    subcircuit: true,
    autorouterVersion: "v6",
  })
  expect(result.autorouterVersion).toBe("v6")
})
