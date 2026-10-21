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

test("drawing intent is explicit and invalid sizes/planes are rejected", () => {
  expect(
    engineeringDrawingProps.safeParse({ width: 210, height: 297 }).success,
  ).toBe(false)
  const view = { direction: "isometric", width: 80, height: 60 }
  for (const patch of [
    { width: 0 },
    { height: -1 },
    { scale: 0 },
    { scale: Infinity },
    { direction: "front" },
    { section: { axis: "x", offset: 0 } },
    { section: { axis: "z", offset: 2, keepSide: "less", hatchSpacing: 0 } },
  ])
    expect(engineeringViewProps.safeParse({ ...view, ...patch }).success).toBe(
      false,
    )
  expect(
    engineeringViewProps.parse({ ...view, scale: 0.5, showHiddenEdges: true })
      .scale,
  ).toBe(0.5)
})
