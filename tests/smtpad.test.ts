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
    coveredWithSolderMask: true,
  }

  expectTypeOf(rawProps).toMatchTypeOf<z.input<typeof polygonSmtPadProps>>()

  const parsed = polygonSmtPadProps.parse(rawProps)
  expect(parsed.name).toBe("pad1")
  expect(parsed.points.length).toBe(3)
  expect(parsed.pcbY).toBe(1)
  expect(parsed.coveredWithSolderMask).toBe(true)

  const parsedUnion = smtPadProps.parse(rawProps)
  if (parsedUnion.shape === "polygon") {
    expect(parsedUnion.name).toBe("pad1")
    expect(parsedUnion.points.length).toBe(3)
    expect(parsedUnion.coveredWithSolderMask).toBe(true)
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

test("should parse RectSmtPadProps with individual solder mask margins", () => {
  const rawProps = {
    shape: "rect",
    width: "1mm",
    height: "2mm",
    solderMaskMarginLeft: "0.1mm",
    solderMaskMarginRight: "0.2mm",
    solderMaskMarginTop: "0.3mm",
    solderMaskMarginBottom: "0.4mm",
  } as const

  const parsed = smtPadProps.parse(rawProps)
  if (parsed.shape === "rect") {
    expect(parsed.solderMaskMarginLeft).toBe(0.1)
    expect(parsed.solderMaskMarginRight).toBe(0.2)
    expect(parsed.solderMaskMarginTop).toBe(0.3)
    expect(parsed.solderMaskMarginBottom).toBe(0.4)
  } else {
    throw new Error("Expected RectSmtPadProps")
  }
})
