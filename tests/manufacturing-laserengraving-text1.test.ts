import { expect, test } from "bun:test"
import {
  type ManufacturingLaserEngravingTextProps,
  manufacturingLaserEngravingTextProps,
  manufacturingProps,
} from "../lib"

test("laserengraving.text parses distances, rotation and placement defaults", () => {
  const input = {
    name: " REV ",
    text: "REV B",
    surfaceRef: " topSurface ",
    fontSize: "3mm",
    font: "tscircuit2024",
    textStyle: "outline",
    distanceFromSurfaceLeftEdge: "4mm",
    yOffsetFromSurfaceCenter: "-0.25in",
    anchorAlignment: "top_left",
    rotationOnSurface: "90deg",
    engravingDepth: "0.1mm",
    resultingColor: "#222222",
  } satisfies ManufacturingLaserEngravingTextProps

  expect(manufacturingProps.laserengraving.text).toBe(
    manufacturingLaserEngravingTextProps,
  )
  expect(manufacturingLaserEngravingTextProps.parse(input)).toEqual({
    name: "REV",
    text: "REV B",
    surfaceRef: "topSurface",
    fontSize: 3,
    font: "tscircuit2024",
    textStyle: "outline",
    distanceFromSurfaceLeftEdge: 4,
    yOffsetFromSurfaceCenter: -6.35,
    anchorAlignment: "top_left",
    rotationOnSurface: 90,
    engravingDepth: 0.1,
    resultingColor: "#222222",
  })

  // A named reference surface, centered, with nothing else assumed.
  expect(
    manufacturingLaserEngravingTextProps.parse({
      text: "SN 0001",
      surfaceRef: "badge",
      fontSize: 2.5,
    }),
  ).toEqual({
    text: "SN 0001",
    surfaceRef: "badge",
    fontSize: 2.5,
    anchorAlignment: "center",
  })
})
