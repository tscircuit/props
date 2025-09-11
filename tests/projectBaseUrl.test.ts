import { expect, test } from "bun:test"
import { platformConfig } from "lib/platformConfig"

test("projectBaseUrl can be set", () => {
  const config = platformConfig.parse({
    projectBaseUrl: "https://example.com/",
  })
  expect(config.projectBaseUrl).toBe("https://example.com/")
})
