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
    for (const sign of ["+", "-"] as const)
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
      centerZOffset: "1mm",
    }),
  ).toEqual({
    name: "anchor",
    shape: "rect",
    plane: "xy",
    normalDirection: "z+",
    centerXOffset: 0,
    centerYOffset: 0,
    centerZOffset: 1,
  })
  expect(
    assemblyReferenceSurfaceProps.parse({
      name: " board ",
      plane: "yz",
      normalDirection: "x-",
      centerXOffset: "-0.1in",
      width: "1in",
      height: "2mm",
    }),
  ).toMatchObject({
    name: "board",
    centerXOffset: -2.54,
    width: 25.4,
    height: 2,
  })
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
    { centerZOffset: Infinity },
    { centerXOffset: "nope" },
    { width: 10 },
    { width: 0, height: 10 },
    { width: 10, height: -1 },
  ])
    expect(assemblyReferenceSurfaceProps.safeParse(input).success).toBe(false)
})
