import { expect, test } from "bun:test"
import { readFileSync } from "node:fs"
import { extractInterfaces } from "../scripts/generate-component-types"

test("does not add unrelated aliases to the legacy documentation", () => {
  for (const [file, alias] of [
    ["autocomplete", "AutocompleteString"],
    ["cadModel", "CadModelAxisDirection"],
  ]) {
    const source = readFileSync(`lib/common/${file}.ts`, "utf8")
    expect(extractInterfaces(source).join("")).not.toContain(
      `export type ${alias}`,
    )
  }
})
