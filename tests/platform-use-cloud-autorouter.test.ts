import { expect, test } from "bun:test"
import { platformConfig, type PlatformConfig } from "../lib/platformConfig"

test("platform cloud autorouting is an optional boolean preserved by parsing", () => {
  for (const value of [true, false, undefined]) {
    const config: PlatformConfig = { useCloudAutorouter: value }
    expect(platformConfig.parse(config).useCloudAutorouter).toBe(value)
  }
  expect(platformConfig.parse({})).not.toHaveProperty("useCloudAutorouter")
  expect(platformConfig.safeParse({ useCloudAutorouter: "true" }).success).toBe(false)
})
