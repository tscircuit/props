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

test("still supports deprecated kebab-case presets", () => {
  const result = autorouterProp.parse("auto-cloud")
  expect(result).toBe("auto-cloud")
})
