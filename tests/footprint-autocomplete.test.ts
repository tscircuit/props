import { expect, test } from "bun:test"
import type {
  FootprintProp,
  BasicFootprint,
  FootprintSoupElements,
} from "lib/common/footprintProp"
import type { AutocompleteString } from "lib/common/autocomplete"
import type { KicadAutocompleteStringPath } from "lib/generated/kicad-autocomplete"
import { expectTypesMatch } from "lib/typecheck"

// This test ensures the footprint prop accepts autocomplete strings

expectTypesMatch<
  FootprintProp,
  | AutocompleteString<BasicFootprint>
  | KicadAutocompleteStringPath
  | React.ReactElement
  | FootprintSoupElements[]
>(true)

test("dummy", () => {
  expect(true).toBe(true)
})
