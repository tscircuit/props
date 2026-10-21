import { expect, test } from "bun:test"
import { engineeringDrawingProps, engineeringViewProps } from "../lib"

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
