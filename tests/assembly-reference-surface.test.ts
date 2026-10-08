import { expect, test } from "bun:test"
import { assemblyReferenceSurfaceProps, assemblyProps } from "lib"

test("reference surfaces normalize unit-aware offsets and optional rectangular extents", () => {
  expect(assemblyProps.referencesurface).toBe(assemblyReferenceSurfaceProps)
  expect(
    assemblyReferenceSurfaceProps.parse({
      shape: "rect",
      plane: "xy",
      zOffset: "1mm",
    }),
  ).toEqual({
    name: "anchor",
    shape: "rect",
    plane: "xy",
    normalDirection: "positive",
    xOffset: 0,
    yOffset: 0,
    zOffset: 1,
  })
  expect(
    assemblyReferenceSurfaceProps.parse({
      name: " board ",
      plane: "yz",
      normalDirection: "negative",
      xOffset: "-0.1in",
      width: "1in",
      height: "2mm",
    }),
  ).toMatchObject({ name: "board", xOffset: -2.54, width: 25.4, height: 2 })
})

test("reference surfaces reject invalid dimensions, names, planes and offsets", () => {
  for (const input of [
    { name: " " },
    { shape: "circle" },
    { plane: "xyz" },
    { normalDirection: "up" },
    { zOffset: Infinity },
    { xOffset: "nope" },
    { width: 10 },
    { width: 0, height: 10 },
    { width: 10, height: -1 },
  ])
    expect(assemblyReferenceSurfaceProps.safeParse(input).success).toBe(false)
})
