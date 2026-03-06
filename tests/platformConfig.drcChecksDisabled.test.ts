import { expect, test } from "bun:test"
import { platformConfig } from "lib/platformConfig"

test("platformConfig accepts optional DRC check disable flags", () => {
  const config = platformConfig.parse({
    drcChecksDisabled: true,
    netlistDrcChecksDisabled: true,
    routingDrcChecksDisabled: false,
    placementDrcChecksDisabled: true,
  })

  expect(config.drcChecksDisabled).toBe(true)
  expect(config.netlistDrcChecksDisabled).toBe(true)
  expect(config.routingDrcChecksDisabled).toBe(false)
  expect(config.placementDrcChecksDisabled).toBe(true)
})
