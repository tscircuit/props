import { expect, test } from "bun:test"
import { symbolProps, type SymbolProps } from "lib/components/symbol"
import { expectTypeOf } from "expect-type"

test("should parse SymbolProps without facing direction", () => {
  const parsed = symbolProps.parse({})
  expect(parsed.originalFacingDirection).toBeUndefined()
})

test("should parse SymbolProps with provided facing direction", () => {
  const rawProps: SymbolProps = { originalFacingDirection: "up" }
  expectTypeOf(rawProps).toMatchTypeOf<SymbolProps>()
  const parsed = symbolProps.parse(rawProps)
  expect(parsed.originalFacingDirection).toBe("up")
})
