import { expect, test } from "bun:test"
import { expectTypeOf } from "expect-type"
import { platedHoleProps, type PlatedHoleProps } from "lib"
import type { z } from "zod"

const holes = [
  { shape: "circle", holeDiameter: 1, outerDiameter: 2 },
  { shape: "oval", holeWidth: 1, holeHeight: 2, outerWidth: 2, outerHeight: 3 },
  { shape: "pill", holeWidth: 1, holeHeight: 2, outerWidth: 2, outerHeight: 3 },
  {
    shape: "circular_hole_with_rect_pad",
    holeDiameter: 1,
    rectPadWidth: 2,
    rectPadHeight: 3,
  },
  {
    shape: "pill_hole_with_rect_pad",
    holeWidth: 1,
    holeHeight: 2,
    rectPadWidth: 2,
    rectPadHeight: 3,
  },
  {
    shape: "hole_with_polygon_pad",
    holeShape: "circle",
    holeDiameter: 1,
    holeOffsetX: 0,
    holeOffsetY: 0,
    padOutline: [
      { x: -1, y: -1 },
      { x: 1, y: -1 },
      { x: 1, y: 1 },
      { x: -1, y: 1 },
    ],
  },
] satisfies PlatedHoleProps[]

test("solderPaste accepts explicit booleans on every plated-hole shape", () => {
  for (const hole of holes) {
    for (const solderPaste of [true, false]) {
      const props: PlatedHoleProps = { ...hole, solderPaste }
      expect(platedHoleProps.parse(props)).toEqual({
        ...platedHoleProps.parse(hole),
        solderPaste,
      })
    }
  }
  expectTypeOf<PlatedHoleProps["solderPaste"]>().toEqualTypeOf<
    boolean | undefined
  >()
  expectTypeOf<z.output<typeof platedHoleProps>["solderPaste"]>().toEqualTypeOf<
    boolean | undefined
  >()
})

test("omitted and undefined solderPaste stay unspecified", () => {
  for (const hole of holes) {
    expect(platedHoleProps.parse(hole).solderPaste).toBeUndefined()
    expect(
      platedHoleProps.parse({ ...hole, solderPaste: undefined }).solderPaste,
    ).toBeUndefined()
  }
})

test("solderPaste rejects non-boolean inputs on every plated-hole shape", () => {
  for (const hole of holes) {
    for (const solderPaste of ["true", "false", 0, 1, null, [], {}]) {
      expect(platedHoleProps.safeParse({ ...hole, solderPaste }).success).toBe(
        false,
      )
    }
  }
})

test("shape inference preserves solderPaste", () => {
  expect(platedHoleProps.parse({ solderPaste: true })).toMatchObject({
    shape: "circle",
    solderPaste: true,
  })
})
