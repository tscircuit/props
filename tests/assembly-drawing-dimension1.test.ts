import { expect, test } from "bun:test"
import { createElement } from "react"
import { expectTypeOf } from "expect-type"
import {
  assemblyProps,
  assemblyDrawingDimensionProps,
  assemblyDrawingPartViewProps,
  type AssemblyDrawingDimensionProps,
  type InferredAssemblyDrawingDimensionProps,
} from "../lib"

test("dimension props preserve only authoring intent and stable identity", () => {
  expectTypeOf<keyof AssemblyDrawingDimensionProps>().toEqualTypeOf<
    "name" | "edgeRef" | "widthOfView" | "heightOfView"
  >()
  expectTypeOf<InferredAssemblyDrawingDimensionProps>().toEqualTypeOf<AssemblyDrawingDimensionProps>()
  expect(assemblyProps.drawing.dimension).toBe(assemblyDrawingDimensionProps)
  expect(
    assemblyDrawingDimensionProps.parse({ edgeRef: " .tube > .inner_top " }),
  ).toEqual({ edgeRef: ".tube > .inner_top" })
  expect(
    assemblyDrawingDimensionProps.parse({
      name: "bore-width",
      edgeRef: ".tube > .inner_top",
    }),
  ).toEqual({ name: "bore-width", edgeRef: ".tube > .inner_top" })
  expect(assemblyDrawingDimensionProps.parse({ widthOfView: true })).toEqual({
    widthOfView: true,
  })
  expect(assemblyDrawingDimensionProps.parse({ heightOfView: true })).toEqual({
    heightOfView: true,
  })
  for (const target of [
    { edgeRef: ".tube > .inner_top" },
    { widthOfView: true },
    { heightOfView: true },
  ])
    expect(
      assemblyDrawingDimensionProps.parse({
        ...target,
        orientation: "horizontal",
        offset: "-8mm",
        precision: 2,
        start: { x: -17, y: 18 },
        end: { x: 17, y: 18 },
        text: "34.0",
      }),
    ).toEqual(target)
  const child = createElement("assembly.drawing.dimension", {
    heightOfView: true,
  })
  const props = assemblyDrawingPartViewProps.parse({
    partRef: ".tube",
    direction: "z+",
    width: "80mm",
    height: "60mm",
    children: child,
  })
  expect(props.children).toBe(child)
  expect(props.partRef).toBe(".tube")
  expect([props.centerX, props.centerY]).toEqual([0, 0])
})
