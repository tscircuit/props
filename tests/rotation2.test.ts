import { expect, test } from "bun:test"
import {
  manufacturingLaserEngravingImageProps,
  manufacturingLaserEngravingTextProps,
  netLabelProps,
  resistorProps,
  schematicRectProps,
  schematicTextProps,
} from "../lib"

test("rotation props share the direction-aware parser", () => {
  const text = { text: "A", fontSize: 2, surfaceRef: "topSurface" }
  const image = { imageUrl: "./a.svg", width: 5, surfaceRef: "topSurface" }
  const resistor = { name: "R1", resistance: "1k" }

  for (const [input, degrees] of [
    ["90deg ccw", 90],
    ["90deg cw", -90],
    ["270deg", 270],
    ["-90", -90],
    [45, 45],
  ] as const) {
    expect(
      manufacturingLaserEngravingTextProps.parse({
        ...text,
        rotationOnSurface: input,
      }).rotationOnSurface,
    ).toBe(degrees)
    expect(
      manufacturingLaserEngravingImageProps.parse({
        ...image,
        rotationOnSurface: input,
      }).rotationOnSurface,
    ).toBe(degrees)
    const parsedResistor = resistorProps.parse({
      ...resistor,
      pcbRotation: input,
      schRotation: input,
    })
    expect(parsedResistor.pcbRotation).toBe(degrees)
    expect(parsedResistor.schRotation).toBe(degrees)
    expect(
      schematicTextProps.parse({ text: "A", schRotation: input }).schRotation,
    ).toBe(degrees)
    expect(
      schematicRectProps.parse({ width: 1, height: 1, rotation: input })
        .rotation,
    ).toBe(degrees)
    expect(netLabelProps.parse({ schRotation: input }).schRotation).toBe(
      degrees,
    )
  }

  for (const invalid of ["90deg clockwise", "ninety", Number.NaN]) {
    expect(
      manufacturingLaserEngravingTextProps.safeParse({
        ...text,
        rotationOnSurface: invalid,
      }).success,
    ).toBe(false)
    expect(
      resistorProps.safeParse({ ...resistor, pcbRotation: invalid }).success,
    ).toBe(false)
    expect(
      schematicTextProps.safeParse({ text: "A", schRotation: invalid }).success,
    ).toBe(false)
  }

  // Omitted rotations keep their existing defaults.
  expect(schematicTextProps.parse({ text: "A" }).schRotation).toBe(0)
  expect(resistorProps.parse(resistor).pcbRotation).toBeUndefined()
})
