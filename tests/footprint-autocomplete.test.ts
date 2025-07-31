import { expect, test } from "bun:test"
import type {
  FootprintProp,
  BasicFootprint,
  FootprintSoupElements,
} from "lib/common/footprintProp"
import type { AutocompleteString } from "lib/common/autocomplete"
import { expectTypesMatch } from "lib/typecheck"

// This test ensures the footprint prop accepts autocomplete strings

expectTypesMatch<
  FootprintProp,
  | AutocompleteString<BasicFootprint>
  | React.ReactElement
  | FootprintSoupElements[]
>(true)

test("dummy", () => {
  expect(true).toBe(true)
})
