import { expect, test } from "bun:test"
import { smtPadProps } from "lib/components/smtpad"

test.failing("rectangular pads retain a relative solder paste margin", () => {
  for (const pad of [
    { shape: "rect", width: 0.6, height: 1.1 },
    { shape: "rotated_rect", width: 0.6, height: 1.1, ccwRotation: 37 },
  ]) {
    for (const ratio of [-0.05, 0, 0.1]) {
      expect(
        smtPadProps.parse({ ...pad, solderPasteMarginRatio: ratio }),
      ).toMatchObject({ solderPasteMarginRatio: ratio })
    }
  }
})
