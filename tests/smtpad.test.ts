import { expect, test } from "bun:test"
import {
  smtPadProps,
  polygonSmtPadProps,
  type PolygonSmtPadProps,
  type SmtPadProps,
} from "lib/components/smtpad"
import { expectTypeOf } from "expect-type"
import { z } from "zod"

test("should parse PolygonSmtPadProps", () => {
  const rawProps: PolygonSmtPadProps = {
    name: "pad1",
    shape: "polygon",
    points: [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
    ],
    pcbX: 0,
    pcbY: "1mm",
  }

  expectTypeOf(rawProps).toMatchTypeOf<z.input<typeof polygonSmtPadProps>>()

  const parsed = polygonSmtPadProps.parse(rawProps)
  expect(parsed.name).toBe("pad1")
  expect(parsed.points.length).toBe(3)
  expect(parsed.pcbY).toBe(1)

  const parsedUnion = smtPadProps.parse(rawProps)
  if (parsedUnion.shape === "polygon") {
    expect(parsedUnion.name).toBe("pad1")
    expect(parsedUnion.points.length).toBe(3)
  } else {
    throw new Error("Expected PolygonSmtPadProps")
  }
})

test("type inference for SmtPadProps", () => {
  const polygon: SmtPadProps = {
    shape: "polygon",
    points: [{ x: 0, y: 0 }],
  }
  expectTypeOf(polygon).toMatchTypeOf<PolygonSmtPadProps>()
})
