import { expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import { extractInterfaces } from "../scripts/generate-component-types"

test("documents endpoint aliases and every union member, including per-leg models", () => {
  const source = readFileSync("lib/components/pcb-channel.ts", "utf8")
  const endpoint = source
    .slice(
      source.indexOf("export type SignalEndpoint"),
      source.indexOf("const pin"),
    )
    .trim()
  const definitions = extractInterfaces(source)
  expect(definitions).toContain("export type SignalPin = string\n")
  expect(definitions).toContain(
    "export type SignalPair = { p: string; n: string }\n",
  )
  expect(definitions.join("")).toContain(endpoint)
})
