import { expect, test } from "bun:test"
import { smtPadProps } from "lib/components/smtpad"

test("paste margin ratios reject objects and non-finite values", () => {
  for (const ratio of [
    Infinity,
    -Infinity,
    NaN,
    { x: -0.05, y: -0.1 },
    "-5%",
  ]) {
    expect(
      smtPadProps.safeParse({
        shape: "rect",
        width: 0.6,
        height: 1.1,
        solderPasteMarginRatio: ratio,
      }).success,
    ).toBe(false)
  }
})
