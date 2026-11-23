import { expect, test } from "bun:test"
import { smtPadProps } from "lib/components/smtpad"

test.failing(
  "paste ratios reject missing axes and non-finite fractions",
  () => {
    for (const ratio of [
      { x: -0.05 },
      { y: -0.1 },
      { x: Infinity, y: 0 },
      { x: 0, y: -Infinity },
      { x: NaN, y: 0 },
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
  },
)
