import { expect, test } from "bun:test"
import { rotation } from "lib/common/rotation"

test("rotation honors ccw and cw and parses to degrees counterclockwise", () => {
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
    expect(rotation.parse(input)).toBe(degrees)
  }
  expect(rotation.parse("3.141592653589793rad")).toBe(180)
  expect(rotation.parse("1.5707963267948966rad cw")).toBe(-90)

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
    expect(rotation.safeParse(invalid).success).toBe(false)
  }
})
