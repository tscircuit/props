import { expect, test } from "bun:test"
import { platformConfig, type PlatformConfig } from "../lib/platformConfig"

test("runtime bundle bases preserve absolute and relative URLs", () => {
  for (const jscdnBaseUrl of [
    "https://packages.example.com/js/",
    "http://localhost:3020/jscdn",
    "/jscdn",
    "./jscdn",
  ]) {
    const config: PlatformConfig = { jscdnBaseUrl }
    expect(platformConfig.parse(config).jscdnBaseUrl).toBe(jscdnBaseUrl)
  }
  expect(platformConfig.parse({})).not.toHaveProperty("jscdnBaseUrl")
  expect(platformConfig.parse({ jscdnBaseUrl: undefined }).jscdnBaseUrl).toBe(
    undefined,
  )
})

test("runtime bundle bases reject empty and non-string values", () => {
  for (const jscdnBaseUrl of ["", "  ", null, 42, false]) {
    expect(platformConfig.safeParse({ jscdnBaseUrl }).success).toBe(false)
  }
})

test("runtime bundle configuration retains a custom transport", () => {
  const platformFetch: typeof fetch = Object.assign(
    async () => new Response("export {}"),
    { preconnect: fetch.preconnect },
  )
  const parsed = platformConfig.parse({ jscdnBaseUrl: "/jscdn", platformFetch })
  expect(parsed.platformFetch).toBe(platformFetch)
  expect(parsed.jscdnBaseUrl).toBe("/jscdn")
})
