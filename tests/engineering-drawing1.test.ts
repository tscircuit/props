import { expect, test } from "bun:test"
import { engineeringDrawingProps, engineeringViewProps } from "../lib"

test("drawing paper and section distances normalize to mm", () => {
  expect(
    engineeringDrawingProps.parse({
      target: "board",
      width: "210mm",
      height: "29.7cm",
    }),
  ).toEqual({ target: "board", width: 210, height: 297 })
  expect(
    engineeringViewProps.parse({
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
    style: "edges",
    showHiddenEdges: false,
    section: { axis: "x", offset: -2, keepSide: "greater", hatchSpacing: 1 },
  })
})
