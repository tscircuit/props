import { expect, test } from "bun:test"
import { platformConfig } from "lib/platformConfig"

test("availability checks require an explicit boolean opt-in", () => {
  expect(platformConfig.parse({}).checkAvailability).toBeUndefined()
  expect(
    platformConfig.parse({ checkAvailability: false }).checkAvailability,
  ).toBe(false)
  expect(
    platformConfig.parse({ checkAvailability: true }).checkAvailability,
  ).toBe(true)
  expect(platformConfig.safeParse({ checkAvailability: "true" }).success).toBe(
    false,
  )
})
