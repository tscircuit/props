import { expect, test } from "bun:test"
import { assemblyDrawingPageProps, assemblyDrawingPartViewProps } from "../lib"

test("drawing intent is explicit and invalid sizes/planes are rejected", () => {
  expect(
    assemblyDrawingPageProps.safeParse({ width: 0, height: 297 }).success,
  ).toBe(false)
  const view = {
    partRef: ".housing",
    direction: "isometric" as const,
    width: 80,
    height: 60,
  }
  for (const patch of [
    { width: 0 },
    { height: -1 },
    { partRef: "" },
    { centerX: Infinity },
    { centerY: NaN },
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
      showHiddenEdges: true,
    }).showHiddenEdges,
  ).toBe(true)
  expect(
    assemblyDrawingPartViewProps.parse({
      ...view,
      centerX: "-4.5cm",
      centerY: "60mm",
      target: ".old",
      x: 12,
      y: 34,
      scale: 0.5,
    }),
  ).toEqual({
    ...view,
    centerX: -45,
    centerY: 60,
    showHiddenEdges: false,
  })
  const { partRef, ...withoutPartRef } = view
  expect(
    assemblyDrawingPartViewProps.safeParse({
      ...withoutPartRef,
      target: partRef,
    }).success,
  ).toBe(false)
})
