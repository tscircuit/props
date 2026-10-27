import { expect, test } from "bun:test"
import { expectTypeOf } from "expect-type"
import {
  symbolProps,
  type SymbolProps,
  type SymbolPropsInput,
} from "lib/components/symbol"

test("invalid symbol viewbox shapes explain the required local bounds", () => {
  expectTypeOf<SymbolPropsInput["viewbox"]>().toEqualTypeOf<
    SymbolProps["viewbox"]
  >()

  for (const viewbox of [
    { x: -0.5, y: -0.5, width: 1, height: 1 },
    { minX: -0.5, maxX: 0.5, minY: -0.5 },
  ]) {
    const parsed = symbolProps.safeParse({ width: 2, fit: "contain", viewbox })
    expect(parsed.success).toBe(false)
    if (parsed.success) throw new Error("Expected invalid viewbox bounds")

    expect(parsed.error.issues).toEqual([
      expect.objectContaining({
        path: ["viewbox"],
        message:
          "viewbox requires { minX, maxX, minY, maxY } bounds in the local symbol coordinate space.",
      }),
    ])
  }
})
