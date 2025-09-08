import { expect, test } from "bun:test"
import type { SymbolProp } from "lib/common/symbolProp"
import { expectTypesMatch } from "lib/typecheck"

expectTypesMatch<SymbolProp, string | React.ReactElement>(true)

test("dummy", () => {
  expect(true).toBe(true)
})
