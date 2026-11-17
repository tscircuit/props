import { expect, test } from "bun:test"
import { manufacturingLaserEngravingTextProps } from "../lib"

test("laserengraving.text rejects missing, blank and out-of-range values", () => {
  const valid = { text: "REV B", surfaceRef: "topSurface", fontSize: "3mm" }
  expect(manufacturingLaserEngravingTextProps.safeParse(valid).success).toBe(
    true,
  )
  for (const invalid of [
    { ...valid, text: " " },
    { ...valid, surfaceRef: " " },
    { ...valid, surfaceRef: undefined },
    { ...valid, surfaceRef: 3 },
    { ...valid, fontSize: undefined },
    { ...valid, fontSize: 0 },
    { ...valid, fontSize: "-1mm" },
    { ...valid, font: "comic" },
    { ...valid, textStyle: "hatched" },
    { ...valid, name: " " },
    { ...valid, engravingDepth: 0 },
    { ...valid, engravingDepth: Infinity },
    { ...valid, resultingColor: " " },
    { ...valid, anchorAlignment: "middle" },
    { ...valid, rotationOnSurface: Infinity },
  ]) {
    expect(
      manufacturingLaserEngravingTextProps.safeParse(invalid).success,
    ).toBe(false)
  }
})
