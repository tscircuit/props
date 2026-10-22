import { expect, test } from "bun:test"
import { assemblyDrawingPageProps, assemblyDrawingPartViewProps } from "../lib"

test("drawing intent is explicit and invalid sizes/planes are rejected", () => {
  expect(
    assemblyDrawingPageProps.safeParse({ width: 0, height: 297 }).success,
  ).toBe(false)
  const view = {
    target: ".housing",
    direction: "isometric",
    width: 80,
    height: 60,
  }
  for (const patch of [
    { width: 0 },
    { height: -1 },
    { scale: 0 },
    { scale: Infinity },
    { direction: "front" },
    { section: { axis: "x", offset: 0 } },
    { section: { axis: "z", offset: 2, keepSide: "less", hatchSpacing: 0 } },
  ])
    expect(
      assemblyDrawingPartViewProps.safeParse({ ...view, ...patch }).success,
    ).toBe(false)
  expect(
    assemblyDrawingPartViewProps.parse({
      ...view,
      scale: 0.5,
      showHiddenEdges: true,
    }).scale,
  ).toBe(0.5)
})
