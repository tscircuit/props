import { expect, test } from "bun:test"
import { symbolProps, type SymbolProps } from "lib/components/symbol"
import { expectTypeOf } from "expect-type"

test("symbol objectFit accepts fill and contain, and is unset by default", () => {
  expect(symbolProps.parse({}).objectFit).toBeUndefined()
  const raw: SymbolProps = { width: 2, objectFit: "contain" }
  expectTypeOf(raw).toMatchTypeOf<SymbolProps>()
  expect(symbolProps.parse(raw).objectFit).toBe("contain")
  expect(symbolProps.parse({ objectFit: "fill" }).objectFit).toBe("fill")
  expect(() => symbolProps.parse({ objectFit: "cover" })).toThrow()
})
