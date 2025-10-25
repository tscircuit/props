import { expect, test } from "bun:test"
import { platformConfig } from "lib/platformConfig"

test("resolveProjectStaticFileImportUrl returns the provided string", async () => {
  const config = platformConfig.parse({
    resolveProjectStaticFileImportUrl: async (path: string) =>
      `https://cdn.example.com/${path}`,
  })

  expect(config.resolveProjectStaticFileImportUrl).toBeDefined()
  const resolver = config.resolveProjectStaticFileImportUrl
  const url = resolver ? await resolver("images/logo.png") : undefined
  expect(url).toBe("https://cdn.example.com/images/logo.png")
})
