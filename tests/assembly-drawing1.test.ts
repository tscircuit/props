import { expect, test } from "bun:test"
import {
  assemblyProps,
  assemblyDrawingProps,
  assemblyDrawingViewProps,
} from "../lib"

test("assembly drawing schemas are registered and distances normalize to mm", () => {
  expect(assemblyProps.drawing).toBe(assemblyDrawingProps)
  expect(assemblyProps.drawingview).toBe(assemblyDrawingViewProps)
  expect(
    assemblyDrawingProps.parse({
      target: "board",
      width: "210mm",
      height: "29.7cm",
    }),
  ).toEqual({ target: "board", width: 210, height: 297 })
  expect(
    assemblyDrawingViewProps.parse({
      direction: "z+",
      width: "4cm",
      height: 30,
      section: { axis: "x", offset: "-2mm", keepSide: "greater" },
    }),
  ).toEqual({
    direction: "z+",
    width: 40,
    height: 30,
    x: 0,
    y: 0,
    showHiddenEdges: false,
    section: { axis: "x", offset: -2, keepSide: "greater", hatchSpacing: 1 },
  })
})
