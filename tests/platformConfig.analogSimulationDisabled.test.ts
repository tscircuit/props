import { expect, test } from "bun:test"
import { platformConfig } from "lib/platformConfig"

test("platformConfig accepts analogSimulationDisabled", () => {
  expect(
    platformConfig.parse({ analogSimulationDisabled: true })
      .analogSimulationDisabled,
  ).toBe(true)
  expect(
    platformConfig.parse({ analogSimulationDisabled: false })
      .analogSimulationDisabled,
  ).toBe(false)
  expect(platformConfig.parse({}).analogSimulationDisabled).toBeUndefined()
})
