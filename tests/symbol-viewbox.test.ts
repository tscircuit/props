import { expect, test } from "bun:test"
import { symbolProps, type SymbolProps } from "lib/components/symbol"
import { expectTypeOf } from "expect-type"

test("symbol viewbox parses distances to mm and needs a positive size", () => {
  const raw: SymbolProps = {
    viewbox: { x: -1, y: "-0.5mm", width: "2mm", height: 1 },
  }
  expectTypeOf(raw).toMatchTypeOf<SymbolProps>()
  expect(symbolProps.parse(raw).viewbox).toEqual({
    x: -1,
    y: -0.5,
    width: 2,
    height: 1,
  })
  expect(() =>
    symbolProps.parse({ viewbox: { x: 0, y: 0, width: 0, height: 1 } }),
  ).toThrow()
  expect(() =>
    symbolProps.parse({ viewbox: { x: 0, y: 0, width: 1, height: -1 } }),
  ).toThrow()
})
