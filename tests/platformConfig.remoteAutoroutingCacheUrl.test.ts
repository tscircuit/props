import { expect, test } from "bun:test"
import { platformConfig } from "lib/platformConfig"

test("remoteAutoroutingCacheUrl can be set", () => {
  const config = platformConfig.parse({
    remoteAutoroutingCacheUrl: "https://cache.example.com/autorouting",
  })

  expect(config.remoteAutoroutingCacheUrl).toBe(
    "https://cache.example.com/autorouting",
  )
})
