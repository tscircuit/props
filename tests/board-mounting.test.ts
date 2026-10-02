import { expect, test } from "bun:test"
import { type BoardProps, boardProps } from "lib"

test("board accepts an assembly face target and parses the mounting gap", () => {
  const input: BoardProps = {
    width: "42.3mm",
    height: "42.3mm",
    mountedTo: "NEMA17.backface",
    mountGap: "6mm",
  }
  expect(boardProps.parse(input)).toMatchObject({
    width: 42.3,
    height: 42.3,
    mountedTo: "NEMA17.backface",
    mountGap: 6,
  })
  expect(input.mountGap).toBe("6mm")
})

test("board mounting references are trimmed without interpreting the target", () => {
  expect(boardProps.parse({ mountedTo: "  NEMA17.backface  " }).mountedTo).toBe(
    "NEMA17.backface",
  )
  expect(boardProps.parse({ mountedTo: "MOTOR.frontface" }).mountedTo).toBe(
    "MOTOR.frontface",
  )
})

test("mountGap accepts zero, millimeters, and unit-bearing distances", () => {
  for (const [mountGap, millimeters] of [
    [0, 0],
    [6, 6],
    ["0mm", 0],
    ["6mm", 6],
    ["0.6cm", 6],
    ["0.25in", 6.35],
  ] as const) {
    expect(
      boardProps.parse({ mountedTo: "NEMA17.backface", mountGap }).mountGap,
    ).toBeCloseTo(millimeters)
  }
})

test("mounting preserves existing board defaults and the schema extension API", () => {
  const parsed = boardProps.parse({ width: 20, height: 20 })
  expect(parsed.mountedTo).toBeUndefined()
  expect(parsed.mountGap).toBeUndefined()
  expect(
    boardProps.parse({ mountedTo: "NEMA17.backface" }).mountGap,
  ).toBeUndefined()
  // Preserve the existing ZodObject API used by board schema consumers.
  expect(boardProps.pick({ mountedTo: true }).parse({})).toEqual({})
})

test("mounting references reject missing identity text and non-string values", () => {
  for (const mountedTo of ["", "  ", null, 17, {}]) {
    expect(boardProps.safeParse({ mountedTo }).success).toBe(false)
  }
})

test("mounting gaps reject negative, nonfinite, and invalid distances", () => {
  for (const mountGap of [
    -1,
    "-1mm",
    Number.NaN,
    Number.POSITIVE_INFINITY,
    "Infinitymm",
    "not-a-distance",
    "",
    null,
    {},
  ]) {
    expect(() =>
      boardProps.parse({ mountedTo: "NEMA17.backface", mountGap }),
    ).toThrow()
  }
})
