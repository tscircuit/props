import { expect, test } from "bun:test"
import { platformConfig, type PlatformConfig } from "lib/platformConfig"

test("platformConfig preserves optional positive integer autorouting thread requests", () => {
  expect(platformConfig.parse({}).autorouterThreads).toBeUndefined()

  for (const autorouterThreads of [1, 4, 8]) {
    const config: PlatformConfig = { autorouterThreads }
    expect(platformConfig.parse(config).autorouterThreads).toBe(
      autorouterThreads,
    )
    expect(
      platformConfig.parse({ ...config, useCloudAutorouter: true }),
    ).toEqual({ ...config, useCloudAutorouter: true })
  }

  for (const autorouterThreads of [
    0,
    -1,
    1.5,
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    Number.MAX_SAFE_INTEGER + 1,
    "4",
    null,
  ]) {
    expect(platformConfig.safeParse({ autorouterThreads }).success).toBe(false)
  }
})
