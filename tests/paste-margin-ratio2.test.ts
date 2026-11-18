import { expect, test } from "bun:test"
import { smtPadProps } from "lib/components/smtpad"

test.failing(
  "paste ratios reject missing axes and non-finite fractions",
  () => {
    const pad = { shape: "rect", width: 4, height: 2 }
    expect(
      smtPadProps.safeParse({ ...pad, solderPasteMarginRatio: { x: -0.1 } })
        .success,
    ).toBe(false)
    expect(
      smtPadProps.safeParse({
        ...pad,
        solderPasteMarginRatio: { x: Infinity, y: 0 },
      }).success,
    ).toBe(false)
  },
)
