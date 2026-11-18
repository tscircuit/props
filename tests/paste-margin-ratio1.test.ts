import { expect, test } from "bun:test"
import { smtPadProps } from "lib/components/smtpad"

test.failing("rectangular pads retain separate local-axis paste ratios", () => {
  expect(
    smtPadProps.parse({
      shape: "rect",
      width: 4,
      height: 2,
      solderPasteMarginRatio: { x: -0.1, y: -0.25 },
    }),
  ).toMatchObject({ solderPasteMarginRatio: { x: -0.1, y: -0.25 } })
})
