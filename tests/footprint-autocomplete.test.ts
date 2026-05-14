import { expect, test } from "bun:test"
import type {
  FootprintProp,
  BasicFootprint,
  FootprintSoupElements,
} from "lib/common/footprintProp"
import type { AutocompleteString } from "lib/common/autocomplete"
import type { KicadAutocompleteStringPath } from "lib/generated/kicad-autocomplete"
import type { JlcpcbAutocompleteStringPath } from "lib/generated/jlcpcb-autocomplete"
import type { FootprinterStringExample } from "lib/generated/footprinter-autocomplete"
import { expectTypesMatch } from "lib/typecheck"

// This test ensures the footprint prop accepts autocomplete strings

expectTypesMatch<
  FootprintProp,
  | AutocompleteString<BasicFootprint | FootprinterStringExample>
  | KicadAutocompleteStringPath
  | JlcpcbAutocompleteStringPath
  | React.ReactElement
  | FootprintSoupElements[]
>(true)

test("dummy", () => {
  expect(true).toBe(true)
})
