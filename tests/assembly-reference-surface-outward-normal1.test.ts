import { expect, test } from "bun:test"
import {
  type AssemblyReferenceSurfaceProps,
  assemblyReferenceSurfaceProps,
} from "lib"

test("reference surfaces take outwardNormal and keep normalDirection as an alias", () => {
  const input = {
    name: "badge",
    plane: "xz",
    outwardNormal: "y-",
  } satisfies AssemblyReferenceSurfaceProps
  const parsed = assemblyReferenceSurfaceProps.parse(input)
  expect(parsed.outwardNormal).toBe("y-")
  expect(parsed.normalDirection).toBe("y-")

  // The alias parses to the same output.
  expect(
    assemblyReferenceSurfaceProps.parse({ plane: "xz", normalDirection: "y-" }),
  ).toEqual(
    assemblyReferenceSurfaceProps.parse({ plane: "xz", outwardNormal: "y-" }),
  )
  expect(
    assemblyReferenceSurfaceProps.parse({
      plane: "yz",
      outwardNormal: "x-",
      normalDirection: "x-",
    }).outwardNormal,
  ).toBe("x-")

  for (const [plane, axis] of [
    ["xy", "z"],
    ["xz", "y"],
    ["yz", "x"],
  ] as const) {
    expect(assemblyReferenceSurfaceProps.parse({ plane }).outwardNormal).toBe(
      `${axis}+`,
    )
    for (const sign of ["+", "-"] as const)
      expect(
        assemblyReferenceSurfaceProps.parse({
          plane,
          outwardNormal: `${axis}${sign}`,
        }).outwardNormal,
      ).toBe(`${axis}${sign}`)
  }

  const conflict = assemblyReferenceSurfaceProps.safeParse({
    plane: "xy",
    outwardNormal: "z+",
    normalDirection: "z-",
  })
  expect(conflict.success).toBe(false)
  expect(conflict.error?.issues[0]?.path).toEqual(["normalDirection"])

  const offPlane = assemblyReferenceSurfaceProps.safeParse({
    plane: "xy",
    outwardNormal: "x+",
  })
  expect(offPlane.success).toBe(false)
  expect(offPlane.error?.issues[0]?.path).toEqual(["outwardNormal"])
  expect(
    assemblyReferenceSurfaceProps.safeParse({ outwardNormal: "up" }).success,
  ).toBe(false)
})
