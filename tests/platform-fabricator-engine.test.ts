import { expect, test } from "bun:test"
import { platformConfig, type FabricatorEngine } from "../lib/platformConfig"

test("platformConfig preserves synchronous and asynchronous fabricator engines", () => {
  for (const engine of [
    { runDrcChecks: () => [] },
    { runDrcChecks: async () => [] },
  ] satisfies FabricatorEngine[]) {
    expect(
      platformConfig.parse({ fabricatorEngine: engine }).fabricatorEngine,
    ).toBe(engine)
  }
  expect(platformConfig.parse({}).fabricatorEngine).toBeUndefined()
})

test("platformConfig rejects invalid fabricator engines", () => {
  for (const fabricatorEngine of [null, false, {}, { runDrcChecks: true }]) {
    expect(platformConfig.safeParse({ fabricatorEngine }).success).toBe(false)
  }
})
