import { expect, test } from "bun:test"
import {
  copperPourProps,
  type CircleCopperPourProps,
  type CopperPourProps,
  type PolygonCopperPourProps,
  type RectCopperPourProps,
  circleCopperPourProps,
  polygonCopperPourProps,
  rectCopperPourProps,
} from "lib/components/copper-pour"
import { expectTypeOf } from "expect-type"
import { z } from "zod"

test("should parse RectCopperPourProps", () => {
  const rawProps: RectCopperPourProps = {
    shape: "rect",
    width: 10,
    height: "5mm",
    pcbX: 0,
    pcbY: 0,
    layer: "top",
    connectsTo: "gnd",
  }
  const parsed = rectCopperPourProps.parse(rawProps)
  expect(parsed.shape).toBe("rect")
  expect(parsed.width).toBe(10)
  expect(parsed.height).toBe(5)
  expect(parsed.pcbX).toBe(0)
  expect(parsed.pcbY).toBe(0)
  expect(parsed.layer).toBe("top")
  expect(parsed.connectsTo).toBe("gnd")

  const parsedUnion = copperPourProps.parse(rawProps)
  expect(parsedUnion.shape).toBe("rect")
  if (parsedUnion.shape === "rect") {
    expect(parsedUnion.width).toBe(10)
  }
})

test("should parse CircleCopperPourProps", () => {
  const rawProps: CircleCopperPourProps = {
    shape: "circle",
    radius: "2.5mm",
    pcbX: "1cm",
    pcbY: -5,
    layer: "bottom",
    connectsTo: ["gnd", "vcc"],
  }
  const parsed = circleCopperPourProps.parse(rawProps)
  expect(parsed.shape).toBe("circle")
  expect(parsed.radius).toBe(2.5)
  expect(parsed.pcbX).toBe(10)
  expect(parsed.pcbY).toBe(-5)
  expect(parsed.layer).toBe("bottom")
  expect(parsed.connectsTo).toEqual(["gnd", "vcc"])

  const parsedUnion = copperPourProps.parse(rawProps)
  expect(parsedUnion.shape).toBe("circle")
  if (parsedUnion.shape === "circle") {
    expect(parsedUnion.radius).toBe(2.5)
  }
})

test("should parse PolygonCopperPourProps with pcbX and pcbY", () => {
  const rawProps: PolygonCopperPourProps = {
    shape: "polygon",
    points: [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 5, y: 5 },
    ],
    pcbX: "1mm",
    pcbY: 2,
    layer: "top",
  }
  const parsed = polygonCopperPourProps.parse(rawProps)
  expect(parsed.shape).toBe("polygon")
  expect(parsed.points).toEqual([
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 5, y: 5 },
  ])
  expect(parsed.pcbX).toBe(1)
  expect(parsed.pcbY).toBe(2)

  const parsedUnion = copperPourProps.parse(rawProps)
  expect(parsedUnion.shape).toBe("polygon")
  if (parsedUnion.shape === "polygon") {
    expect(parsedUnion.points?.length).toBe(3)
    expect(parsedUnion.pcbX).toBe(1)
    expect(parsedUnion.pcbY).toBe(2)
  }
})

test("type inference for CopperPourProps", () => {
  const rect: CopperPourProps = {
    shape: "rect",
    width: 1,
    height: 1,
  }
  expectTypeOf(rect).toMatchTypeOf<RectCopperPourProps>()

  const circle: CopperPourProps = {
    shape: "circle",
    radius: 1,
  }
  expectTypeOf(circle).toMatchTypeOf<CircleCopperPourProps>()

  const polygon: CopperPourProps = {
    shape: "polygon",
    points: [{ x: 0, y: 0 }],
  }
  expectTypeOf(polygon).toMatchTypeOf<PolygonCopperPourProps>()
})
