import { expect, test } from "bun:test"
import {
  cutoutProps,
  type CutoutProps,
  type RectCutoutProps,
  type CircleCutoutProps,
  type PolygonCutoutProps,
  rectCutoutProps,
  circleCutoutProps,
  polygonCutoutProps,
} from "lib/components/cutout"
import { expectTypeOf } from "expect-type"
import { z } from "zod"

test("should parse RectCutoutProps", () => {
  const rawProps: RectCutoutProps = {
    name: "rect_cutout_1",
    shape: "rect",
    width: 10,
    height: "5mm",
    pcbX: 0,
    pcbY: 0,
  }
  const parsed = rectCutoutProps.parse(rawProps)
  expect(parsed.name).toBe("rect_cutout_1")
  expect(parsed.shape).toBe("rect")
  expect(parsed.width).toBe(10)
  expect(parsed.height).toBe(5)
  expect(parsed.pcbX).toBe(0)
  expect(parsed.pcbY).toBe(0)

  const parsedUnion = cutoutProps.parse(rawProps)
  expect(parsedUnion.shape).toBe("rect")
  if (parsedUnion.shape === "rect") {
    expect(parsedUnion.width).toBe(10)
  }
})

test("should parse CircleCutoutProps", () => {
  const rawProps: CircleCutoutProps = {
    name: "circle_cutout_1",
    shape: "circle",
    radius: "2.5mm",
    pcbX: "1cm",
    pcbY: -5,
  }
  const parsed = circleCutoutProps.parse(rawProps)
  expect(parsed.name).toBe("circle_cutout_1")
  expect(parsed.shape).toBe("circle")
  expect(parsed.radius).toBe(2.5)
  expect(parsed.pcbX).toBe(10)
  expect(parsed.pcbY).toBe(-5)

  const parsedUnion = cutoutProps.parse(rawProps)
  expect(parsedUnion.shape).toBe("circle")
  if (parsedUnion.shape === "circle") {
    expect(parsedUnion.radius).toBe(2.5)
  }
})

test("should parse PolygonCutoutProps", () => {
  const rawProps: PolygonCutoutProps = {
    name: "polygon_cutout_1",
    shape: "polygon",
    points: [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 5, y: 5 },
    ],
  }
  const parsed = polygonCutoutProps.parse(rawProps)
  expect(parsed.name).toBe("polygon_cutout_1")
  expect(parsed.shape).toBe("polygon")
  expect(parsed.points).toEqual([
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 5, y: 5 },
  ])

  const parsedUnion = cutoutProps.parse(rawProps)
  expect(parsedUnion.shape).toBe("polygon")
  if (parsedUnion.shape === "polygon") {
    expect(parsedUnion.points?.length).toBe(3)
  }
})

test("should parse PolygonCutoutProps without optional pcbX/pcbY", () => {
  const rawProps: PolygonCutoutProps = {
    shape: "polygon",
    points: [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
    ],
  }
  const parsed = polygonCutoutProps.parse(rawProps)
  expect(parsed.shape).toBe("polygon")
})

test("type inference for CutoutProps", () => {
  const rect: CutoutProps = {
    shape: "rect",
    width: 1,
    height: 1,
  }
  expectTypeOf(rect).toMatchTypeOf<RectCutoutProps>()

  const circle: CutoutProps = {
    shape: "circle",
    radius: 1,
  }
  expectTypeOf(circle).toMatchTypeOf<CircleCutoutProps>()

  const polygon: CutoutProps = {
    shape: "polygon",
    points: [{ x: 0, y: 0 }],
  }
  expectTypeOf(polygon).toMatchTypeOf<PolygonCutoutProps>()
})
