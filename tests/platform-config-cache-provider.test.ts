import { expect, test } from "bun:test"
import { platformConfig } from "lib/platformConfig"

test("platformConfig accepts a solver cache provider", () => {
  const cachedSolutions = new Map<string, unknown>()
  const cacheProvider = {
    isSyncCache: true,
    cacheHits: 0,
    cacheMisses: 0,
    cacheHitsByPrefix: {},
    cacheMissesByPrefix: {},
    getCachedSolutionSync: (cacheKey: string) => cachedSolutions.get(cacheKey),
    getCachedSolution: async (cacheKey: string) =>
      cachedSolutions.get(cacheKey),
    setCachedSolutionSync: (cacheKey: string, cachedSolution: unknown) => {
      cachedSolutions.set(cacheKey, cachedSolution)
    },
    setCachedSolution: async (cacheKey: string, cachedSolution: unknown) => {
      cachedSolutions.set(cacheKey, cachedSolution)
    },
    getAllCacheKeys: () => [...cachedSolutions.keys()],
    clearCache: () => cachedSolutions.clear(),
  }

  const parsed = platformConfig.parse({ cacheProvider })

  expect(parsed.cacheProvider).toBe(cacheProvider)
  expect(() => platformConfig.parse({ cacheProvider: {} })).toThrow()
})
