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

test("resolveProjectStaticFileImportUrl validates the resolved URL", async () => {
  const config = platformConfig.parse({
    resolveProjectStaticFileImportUrl: async () => 123,
  })
  const resolver = config.resolveProjectStaticFileImportUrl

  if (!resolver) {
    throw new Error("expected resolveProjectStaticFileImportUrl")
  }

  await expect(resolver("images/logo.png")).rejects.toThrow()
})

test("resolveProjectStaticFileImportUrl validates invocation arguments", async () => {
  const config = platformConfig.parse({
    resolveProjectStaticFileImportUrl: async (path: string) =>
      `https://cdn.example.com/${path}`,
  })
  const resolver = config.resolveProjectStaticFileImportUrl

  if (!resolver) {
    throw new Error("expected resolveProjectStaticFileImportUrl")
  }

  await expect((resolver as any)(123)).rejects.toThrow()
})

test("resolveProjectStaticFileImportUrl rejects non-functions", () => {
  expect(() =>
    platformConfig.parse({
      resolveProjectStaticFileImportUrl: "https://cdn.example.com",
    }),
  ).toThrow()
})
