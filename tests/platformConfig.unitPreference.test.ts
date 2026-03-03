import { expect, test } from "bun:test"
import { platformConfig } from "lib/platformConfig"

test("unitPreference accepts mm, in, and mil", () => {
  expect(platformConfig.parse({ unitPreference: "mm" }).unitPreference).toBe(
    "mm",
  )
  expect(platformConfig.parse({ unitPreference: "in" }).unitPreference).toBe(
    "in",
  )
  expect(platformConfig.parse({ unitPreference: "mil" }).unitPreference).toBe(
    "mil",
  )
})

test("unitPreference rejects unsupported values", () => {
  expect(() => platformConfig.parse({ unitPreference: "cm" })).toThrow()
})
