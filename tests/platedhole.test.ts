import { expect, test } from "bun:test"
import {
  platedHoleProps,
  type PlatedHoleProps,
} from "../lib/components/platedhole"
import { expectTypeOf } from "expect-type"
import type { z } from "zod"

test("should parse CircularHoleWithRectPlatedProps with all required fields", () => {
  const rawProps: PlatedHoleProps = {
    shape: "circularHoleWithRectPad",
    holeDiameter: 5,
    rectPadWidth: 10,
    rectPadHeight: 20,
  }

  expectTypeOf(rawProps).toMatchTypeOf<z.input<typeof platedHoleProps>>()

  const parsedProps = platedHoleProps.parse(rawProps)

  if (parsedProps.shape === "circularHoleWithRectPad") {
    expect(parsedProps.holeDiameter).toBe(5)
    expect(parsedProps.rectPadWidth).toBe(10)
    expect(parsedProps.rectPadHeight).toBe(20)
  } else {
    throw new Error(
      "Expected CircularHoleWithRectPlatedProps, but got a different shape",
    )
  }
})
