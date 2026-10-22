import { expect, test } from "bun:test"
import { createElement } from "react"
import {
  assemblyProps,
  assemblyDrawingDimensionProps,
  assemblyDrawingPartViewProps,
} from "../lib"

test("dimension targets preserve edge selectors and infer view-extent orientation", () => {
  expect(assemblyProps.drawing.dimension).toBe(assemblyDrawingDimensionProps)
  expect(
    assemblyDrawingDimensionProps.parse({ edgeRef: " .tube > .outer_top " }),
  ).toEqual({
    edgeRef: ".tube > .outer_top",
    orientation: "aligned",
    offset: 8,
    precision: 1,
  })
  expect(
    assemblyDrawingDimensionProps.parse({
      name: "tube-width",
      edgeRef: ".tube > .outer_top",
      orientation: "horizontal",
      offset: "-1.2cm",
      precision: 2,
    }),
  ).toEqual({
    name: "tube-width",
    edgeRef: ".tube > .outer_top",
    orientation: "horizontal",
    offset: -12,
    precision: 2,
  })
  expect(assemblyDrawingDimensionProps.parse({ widthOfView: true })).toEqual({
    widthOfView: true,
    orientation: "horizontal",
    offset: 8,
    precision: 1,
  })
  expect(assemblyDrawingDimensionProps.parse({ heightOfView: true })).toEqual({
    heightOfView: true,
    orientation: "vertical",
    offset: 8,
    precision: 1,
  })
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
