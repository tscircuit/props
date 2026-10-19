import { expect, test } from "bun:test"
import { symbolProps } from "lib/components/symbol"

test("symbol viewbox requires increasing bounds on both axes", () => {
  for (const bounds of [
    { minX: 0, maxX: 0, minY: 0, maxY: 1 },
    { minX: 1, maxX: 0, minY: 0, maxY: 1 },
    { minX: 0, maxX: 1, minY: 0, maxY: 0 },
    { minX: 0, maxX: 1, minY: 1, maxY: 0 },
  ]) {
    expect(() => symbolProps.parse({ viewbox: bounds })).toThrow()
  }
})
