import { expect, test } from "bun:test"
import { smtPadProps } from "lib/components/smtpad"

test.failing("rectangular pads retain separate local-axis paste ratios", () => {
  for (const pad of [
    { shape: "rect", width: 0.6, height: 1.1 },
    { shape: "rotated_rect", width: 0.6, height: 1.1, ccwRotation: 37 },
  ]) {
    for (const ratio of [
      { x: -0.05, y: -0.1 },
      { x: 0, y: 0 },
      { x: 0.1, y: 0.05 },
    ]) {
      expect(
        smtPadProps.parse({ ...pad, solderPasteMarginRatio: ratio }),
      ).toMatchObject({ solderPasteMarginRatio: ratio })
    }
  }
})
