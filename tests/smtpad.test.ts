import { expect, test } from "bun:test"
import {
  smtPadProps,
  polygonSmtPadProps,
  rotatedPillSmtPadProps,
  type PolygonSmtPadProps,
  type RotatedPillSmtPadProps,
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

test("should parse RotatedPillSmtPadProps", () => {
  const rawProps: RotatedPillSmtPadProps = {
    name: "pad1",
    shape: "rotated_pill",
    width: "2mm",
    height: "1mm",
    radius: "0.5mm",
    ccwRotation: 90,
    pcbX: "1mm",
    pcbY: 2,
    portHints: ["1"],
  }

  expectTypeOf(rawProps).toMatchTypeOf<z.input<typeof rotatedPillSmtPadProps>>()

  const parsed = rotatedPillSmtPadProps.parse(rawProps)
  expect(parsed).toMatchObject({
    name: "pad1",
    shape: "rotated_pill",
    width: 2,
    height: 1,
    radius: 0.5,
    ccwRotation: 90,
    pcbX: 1,
    pcbY: 2,
    portHints: ["1"],
  })

  const parsedUnion = smtPadProps.parse(rawProps)
  if (parsedUnion.shape !== "rotated_pill") {
    throw new Error("Expected RotatedPillSmtPadProps")
  }
  expect(parsedUnion.ccwRotation).toBe(90)
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

test("should parse solder paste margin on every smtpad shape", () => {
  const rect = smtPadProps.parse({
    shape: "rect",
    width: "1mm",
    height: "2mm",
    solderPasteMargin: "-0.05mm",
  })
  if (rect.shape !== "rect") throw new Error("Expected rect")
  expect(rect.solderPasteMargin).toBe(-0.05)

  const circle = smtPadProps.parse({
    shape: "circle",
    radius: "0.5mm",
    solderPasteMargin: "0.1mm",
  })
  if (circle.shape !== "circle") throw new Error("Expected circle")
  expect(circle.solderPasteMargin).toBe(0.1)

  const rotatedRect = smtPadProps.parse({
    shape: "rotated_rect",
    width: 1,
    height: 1,
    ccwRotation: 45,
    solderPasteMargin: "0.05mm",
  })
  if (rotatedRect.shape !== "rotated_rect")
    throw new Error("Expected rotated_rect")
  expect(rotatedRect.solderPasteMargin).toBe(0.05)

  const pill = smtPadProps.parse({
    shape: "pill",
    width: 2,
    height: 1,
    radius: 0.5,
    solderPasteMargin: -0.1,
  })
  if (pill.shape !== "pill") throw new Error("Expected pill")
  expect(pill.solderPasteMargin).toBe(-0.1)

  const rotatedPill = smtPadProps.parse({
    shape: "rotated_pill",
    width: 2,
    height: 1,
    radius: 0.5,
    ccwRotation: 90,
    solderPasteMargin: -0.1,
  })
  if (rotatedPill.shape !== "rotated_pill") {
    throw new Error("Expected rotated_pill")
  }
  expect(rotatedPill.solderPasteMargin).toBe(-0.1)

  const polygon = smtPadProps.parse({
    shape: "polygon",
    points: [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ],
    solderPasteMargin: 0,
  })
  if (polygon.shape !== "polygon") throw new Error("Expected polygon")
  expect(polygon.solderPasteMargin).toBe(0)
})
