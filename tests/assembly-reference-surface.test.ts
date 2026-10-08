import { expect, test } from "bun:test"
import { assemblyReferenceSurfaceProps, assemblyProps } from "lib"

test("reference surfaces normalize unit-aware offsets and optional rectangular extents", () => {
  for (const [plane, axis] of [
    ["xy", "z"],
    ["xz", "y"],
    ["yz", "x"],
  ] as const) {
    expect(assemblyReferenceSurfaceProps.parse({ plane }).normalDirection).toBe(
      `${axis}+`,
    )
    for (const sign of ["+", "-"])
      expect(
        assemblyReferenceSurfaceProps.parse({
          plane,
          normalDirection: `${axis}${sign}`,
        }).normalDirection,
      ).toBe(`${axis}${sign}`)
  }
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
    normalDirection: "z+",
    xOffset: 0,
    yOffset: 0,
    zOffset: 1,
  })
  expect(
    assemblyReferenceSurfaceProps.parse({
      name: " board ",
      plane: "yz",
      normalDirection: "x-",
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
    { normalDirection: "positive" },
    { normalDirection: "negative" },
    { plane: "xy", normalDirection: "x+" },
    { plane: "xz", normalDirection: "z-" },
    { plane: "yz", normalDirection: "y+" },
    { zOffset: Infinity },
    { xOffset: "nope" },
    { width: 10 },
    { width: 0, height: 10 },
    { width: 10, height: -1 },
  ])
    expect(assemblyReferenceSurfaceProps.safeParse(input).success).toBe(false)
})
