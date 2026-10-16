import { expect, test } from "bun:test"
import { symbolProps, type SymbolProps } from "lib/components/symbol"
import { expectTypeOf } from "expect-type"

test("symbol viewboxPreset takes shape_bounds or shape_and_port_bounds, not with a viewbox", () => {
  expect(symbolProps.parse({}).viewboxPreset).toBeUndefined()
  const raw: SymbolProps = { width: 1, viewboxPreset: "shape_bounds" }
  expectTypeOf(raw).toMatchTypeOf<SymbolProps>()
  expect(symbolProps.parse(raw).viewboxPreset).toBe("shape_bounds")
  expect(
    symbolProps.parse({ viewboxPreset: "shape_and_port_bounds" }).viewboxPreset,
  ).toBe("shape_and_port_bounds")
  expect(() => symbolProps.parse({ viewboxPreset: "bounds" })).toThrow()
  expect(() =>
    symbolProps.parse({
      viewbox: { x: 0, y: 0, width: 1, height: 1 },
      viewboxPreset: "shape_bounds",
    }),
  ).toThrow()
})
