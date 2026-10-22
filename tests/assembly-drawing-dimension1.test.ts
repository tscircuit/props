import { expect, test } from "bun:test"
import { createElement } from "react"
import {
  assemblyProps,
  assemblyDrawingDimensionProps,
  assemblyDrawingPartViewProps,
} from "../lib"

test("dimension intent preserves named-edge association and nested annotations", () => {
  expect(assemblyProps.drawing.dimension).toBe(assemblyDrawingDimensionProps)
  expect(
    assemblyDrawingDimensionProps.parse({ edgeRef: " overall_width " }),
  ).toEqual({
    edgeRef: "overall_width",
    orientation: "aligned",
    offset: 8,
    precision: 1,
  })
  expect(
    assemblyDrawingDimensionProps.parse({
      name: "tube-width",
      edgeRef: "overall_width",
      orientation: "horizontal",
      offset: "-1.2cm",
      precision: 2,
    }),
  ).toEqual({
    name: "tube-width",
    edgeRef: "overall_width",
    orientation: "horizontal",
    offset: -12,
    precision: 2,
  })
  const child = createElement("assembly.drawing.dimension", {
    edgeRef: "overall_height",
    orientation: "vertical",
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
