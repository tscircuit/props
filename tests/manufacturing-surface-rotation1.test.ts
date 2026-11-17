import { expect, test } from "bun:test"
import {
  manufacturingLaserEngravingImageProps,
  manufacturingLaserEngravingTextProps,
  manufacturingSurfaceRotation,
} from "../lib"

test("rotationOnSurface honors ccw and cw and parses to degrees counterclockwise", () => {
  for (const [input, degrees] of [
    ["90deg ccw", 90],
    ["90deg cw", -90],
    ["90deg", 90],
    [90, 90],
    [-45, -45],
    ["-45deg", -45],
    ["90degccw", 90],
    ["90degcw", -90],
    [" 22.5deg  cw ", -22.5],
    ["-90deg cw", 90],
    ["0deg cw", 0],
    ["30 cw", -30],
    ["30", 30],
    [".5deg ccw", 0.5],
  ] as const) {
    expect(manufacturingSurfaceRotation.parse(input)).toBe(degrees)
  }
  expect(manufacturingSurfaceRotation.parse("3.141592653589793rad")).toBe(180)
  expect(manufacturingSurfaceRotation.parse("1.5707963267948966rad cw")).toBe(
    -90,
  )

  for (const invalid of [
    "90deg clockwise",
    "90deg cww",
    "cw",
    "90deg cw ccw",
    "ninety",
    "0.25turn",
    "90°",
    "",
    Infinity,
    Number.NaN,
    null,
  ]) {
    expect(manufacturingSurfaceRotation.safeParse(invalid).success).toBe(false)
  }

  const text = { text: "A", fontSize: 2, surface: "topSurface" }
  const image = { imageUrl: "./a.svg", width: 5, surface: "topSurface" }
  for (const [rotationOnSurface, degrees] of [
    ["90deg ccw", 90],
    ["90deg cw", -90],
  ] as const) {
    expect(
      manufacturingLaserEngravingTextProps.parse({ ...text, rotationOnSurface })
        .rotationOnSurface,
    ).toBe(degrees)
    expect(
      manufacturingLaserEngravingImageProps.parse({
        ...image,
        rotationOnSurface,
      }).rotationOnSurface,
    ).toBe(degrees)
  }
  expect(
    manufacturingLaserEngravingTextProps.safeParse({
      ...text,
      rotationOnSurface: "90deg clockwise",
    }).success,
  ).toBe(false)
})
