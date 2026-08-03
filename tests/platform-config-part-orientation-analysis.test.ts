import { expect, test } from "bun:test"
import { platformConfig } from "lib/platformConfig"

test("platformConfig accepts part orientation analysis and a local cache", () => {
  const cache = new Map<string, string>()
  const parsed = platformConfig.parse({
    enablePartOrientationAnalysis: true,
    localCacheEngine: {
      getItem: (key: string) => cache.get(key) ?? null,
      setItem: (key: string, value: string) => cache.set(key, value),
    },
  })

  expect(parsed.enablePartOrientationAnalysis).toBe(true)
  expect(parsed.localCacheEngine).toBeDefined()
})

test("platformConfig rejects invalid orientation analysis and cache values", () => {
  expect(() =>
    platformConfig.parse({ enablePartOrientationAnalysis: "yes" }),
  ).toThrow()
  expect(() => platformConfig.parse({ localCacheEngine: {} })).toThrow()
})
