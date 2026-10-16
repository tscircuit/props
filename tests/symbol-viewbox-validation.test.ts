import { expect, test } from "bun:test"
import { symbolProps } from "lib/components/symbol"

test("symbol viewbox dimensions must be positive", () => {
  for (const dimensions of [
    { width: 0, height: 1 },
    { width: -1, height: 1 },
    { width: 1, height: 0 },
    { width: 1, height: -1 },
  ]) {
    expect(() =>
      symbolProps.parse({ viewbox: { x: 0, y: 0, ...dimensions } }),
    ).toThrow()
  }
})
