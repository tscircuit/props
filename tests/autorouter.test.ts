import { expect, test } from "bun:test"
import { autorouterProp } from "../lib/components/group"

test("supports freerouting preset", () => {
  const result = autorouterProp.parse("freerouting")
  expect(result).toBe("freerouting")
})

test("supports snake_case presets", () => {
  const result = autorouterProp.parse("auto_cloud")
  expect(result).toBe("auto_cloud")
})

test("supports laser prefab preset", () => {
  const result = autorouterProp.parse("laser_prefab")
  expect(result).toBe("laser_prefab")
})

test("supports tscircuit beta preset", () => {
  const result = autorouterProp.parse("tscircuit_beta")
  expect(result).toBe("tscircuit_beta")
})

test("still supports deprecated kebab-case presets", () => {
  const result = autorouterProp.parse("auto-cloud")
  expect(result).toBe("auto-cloud")
})
