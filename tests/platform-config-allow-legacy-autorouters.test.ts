import { expect, test } from "bun:test"
import { platformConfig } from "lib/platformConfig"

test("platformConfig accepts the legacy autorouter override", () => {
  expect(
    platformConfig.parse({ allowLegacyAutorouters: true })
      .allowLegacyAutorouters,
  ).toBe(true)

  expect(platformConfig.parse({}).allowLegacyAutorouters).toBeUndefined()
})
