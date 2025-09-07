import { expect, test } from "bun:test"
import {
  copperPourProps,
  type CopperPourProps,
  type PolygonCopperPourProps,
  type RectCopperPourProps,
  polygonCopperPourProps,
  rectCopperPourProps,
  type BRepCopperPourProps,
  brepCopperPourProps,
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
    pcbRotation: 90,
  }
  const parsed = rectCopperPourProps.parse(rawProps)
  expect(parsed.shape).toBe("rect")
  expect(parsed.width).toBe(10)
  expect(parsed.height).toBe(5)
  expect(parsed.pcbX).toBe(0)
  expect(parsed.pcbY).toBe(0)
  expect(parsed.layer).toBe("top")
  expect(parsed.connectsTo).toBe("gnd")
  expect(parsed.pcbRotation).toBe(90)

  const parsedUnion = copperPourProps.parse(rawProps)
  expect(parsedUnion.shape).toBe("rect")
  if (parsedUnion.shape === "rect") {
    expect(parsedUnion.width).toBe(10)
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
    layer: "top",
  }
  expectTypeOf(rect).toMatchTypeOf<RectCopperPourProps>()

  const polygon: CopperPourProps = {
    shape: "polygon",
    points: [{ x: 0, y: 0 }],
    layer: "top",
  }
  expectTypeOf(polygon).toMatchTypeOf<PolygonCopperPourProps>()

  const brep: CopperPourProps = {
    shape: "brep",
    brepShape: {
      outer_ring: {
        vertices: [{ x: 0, y: 0 }],
      },
      inner_rings: [],
    },
    layer: "top",
  }
  expectTypeOf(brep).toMatchTypeOf<BRepCopperPourProps>()
})

test("should parse BRepCopperPourProps", () => {
  const rawProps: BRepCopperPourProps = {
    shape: "brep",
    brepShape: {
      outer_ring: {
        vertices: [
          { x: 0, y: 0 },
          { x: 10, y: 0 },
          { x: 10, y: 10 },
          { x: 0, y: 10 },
        ],
      },
      inner_rings: [],
    },
    layer: "top",
    connectsTo: "gnd",
  }
  const parsed = brepCopperPourProps.parse(rawProps)
  expect(parsed.shape).toBe("brep")
  expect(parsed.brepShape.outer_ring.vertices.length).toBe(4)
  expect(parsed.layer).toBe("top")
  expect(parsed.connectsTo).toBe("gnd")
})

test("should parse BRepCopperPourProps with bulge", () => {
  const rawProps: BRepCopperPourProps = {
    shape: "brep",
    brepShape: {
      outer_ring: {
        vertices: [
          { x: 0, y: 0, bulge: 0.5 },
          { x: 10, y: 0 },
          { x: 10, y: 10 },
          { x: 0, y: 10 },
        ],
      },
      inner_rings: [],
    },
    layer: "top",
    connectsTo: "gnd",
  }
  const parsed = brepCopperPourProps.parse(rawProps)
  expect(parsed.shape).toBe("brep")
  expect(parsed.brepShape.outer_ring.vertices.length).toBe(4)
  expect(parsed.brepShape.outer_ring.vertices[0]?.bulge).toBe(0.5)
  expect(parsed.layer).toBe("top")
  expect(parsed.connectsTo).toBe("gnd")
})
