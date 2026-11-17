import { expect, test } from "bun:test"
import {
  manufacturingBuiltInSurfaces,
  manufacturingLaserEngravingImageProps,
  manufacturingLaserEngravingTextProps,
} from "../lib"

test("surface placement allows one position per axis on any surface", () => {
  const text = { text: "A", fontSize: 2 }
  for (const surface of [...manufacturingBuiltInSurfaces, "badge"]) {
    expect(
      manufacturingLaserEngravingTextProps.parse({
        ...text,
        surfaceRef: surface,
      }).surfaceRef,
    ).toBe(surface)
  }

  const xProps = [
    "xOffsetFromSurfaceCenter",
    "distanceFromSurfaceLeftEdge",
    "distanceFromSurfaceRightEdge",
  ]
  const yProps = [
    "yOffsetFromSurfaceCenter",
    "distanceFromSurfaceTopEdge",
    "distanceFromSurfaceBottomEdge",
  ]
  const image = { imageUrl: "./a.svg", width: 5, surfaceRef: "topSurface" }
  for (const schema of [
    (extra: object) =>
      manufacturingLaserEngravingTextProps.safeParse({
        ...text,
        surfaceRef: "topSurface",
        ...extra,
      }),
    (extra: object) =>
      manufacturingLaserEngravingImageProps.safeParse({ ...image, ...extra }),
  ]) {
    for (const x of xProps) {
      for (const y of yProps) {
        expect(schema({ [x]: 1, [y]: "2mm" }).success).toBe(true)
      }
    }
    for (const axis of [xProps, yProps]) {
      for (let i = 0; i < axis.length; i++) {
        for (let j = i + 1; j < axis.length; j++) {
          const result = schema({ [axis[i]!]: 1, [axis[j]!]: 1 })
          expect(result.success).toBe(false)
          expect(result.error?.issues[0]?.path).toEqual([axis[j]!])
        }
      }
    }
    // Center offsets are signed; edge distances cannot hang off the surface.
    expect(schema({ xOffsetFromSurfaceCenter: -3 }).success).toBe(true)
    expect(schema({ distanceFromSurfaceLeftEdge: 0 }).success).toBe(true)
    expect(schema({ distanceFromSurfaceLeftEdge: -1 }).success).toBe(false)
    expect(schema({ distanceFromSurfaceTopEdge: "-1mm" }).success).toBe(false)
    expect(schema({ yOffsetFromSurfaceCenter: Infinity }).success).toBe(false)
  }
})
