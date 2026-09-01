import { expect, test } from "bun:test"
import { platformConfig } from "lib/platformConfig"

test("platformConfig accepts optional showRoutingPlan", () => {
  expect(platformConfig.parse({ showRoutingPlan: true }).showRoutingPlan).toBe(
    true,
  )
  expect(platformConfig.parse({ showRoutingPlan: false }).showRoutingPlan).toBe(
    false,
  )
  expect(platformConfig.parse({}).showRoutingPlan).toBeUndefined()
})

test("platformConfig rejects non-boolean showRoutingPlan values", () => {
  expect(() => platformConfig.parse({ showRoutingPlan: "true" })).toThrow()
  expect(() => platformConfig.parse({ showRoutingPlan: 1 })).toThrow()
})
