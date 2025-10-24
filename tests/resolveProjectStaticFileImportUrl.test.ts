import { expect, test } from "bun:test"
import { platformConfig } from "lib/platformConfig"

test("resolveProjectStaticFileImportUrl returns the provided string", () => {
  const config = platformConfig.parse({
    resolveProjectStaticFileImportUrl: (path: string) =>
      `https://cdn.example.com/${path}`,
  })

  expect(config.resolveProjectStaticFileImportUrl).toBeDefined()
  const url = config.resolveProjectStaticFileImportUrl?.("images/logo.png")
  expect(url).toBe("https://cdn.example.com/images/logo.png")
})
