import { expect, test } from "bun:test"
import {
  assemblyProps,
  assemblyDrawingPageProps,
  assemblyDrawingPartViewProps,
} from "../lib"

test("assembly drawing schemas are registered and distances normalize to mm", () => {
  expect(assemblyProps.drawing.page).toBe(assemblyDrawingPageProps)
  expect(assemblyProps.drawing.partview).toBe(assemblyDrawingPartViewProps)
  expect(
    assemblyDrawingPageProps.parse({
      width: "210mm",
      height: "29.7cm",
    }),
  ).toEqual({ width: 210, height: 297 })
  expect(
    assemblyDrawingPartViewProps.parse({
      target: ".housing",
      direction: "z+",
      width: "4cm",
      height: 30,
      section: { axis: "x", offset: "-2mm", keepSide: "greater" },
    }),
  ).toEqual({
    target: ".housing",
    direction: "z+",
    width: 40,
    height: 30,
    x: 0,
    y: 0,
    showHiddenEdges: false,
    section: { axis: "x", offset: -2, keepSide: "greater", hatchSpacing: 1 },
  })
})
