import { expect, test } from "bun:test"
import { silkscreenTextProps } from "lib/components/silkscreen-text"

test("silkscreen text preserves explicit mirroring on either layer", () => {
  for (const layer of ["top", "bottom"]) {
    for (const mirrored of [true, false, undefined]) {
      expect(
        silkscreenTextProps.parse({ text: "ABC", layer, mirrored }).mirrored,
      ).toBe(mirrored)
    }
  }
  expect(
    silkscreenTextProps.safeParse({ text: "ABC", mirrored: "true" }).success,
  ).toBe(false)
})
