import { expect, test } from "bun:test"
import {
  polygonSolderPasteProps,
  solderPasteProps,
  type SolderPasteProps,
} from "../lib/components/solderpaste"

test("parses independent polygon solder paste with unit-aware local outlines", () => {
  const aperture: SolderPasteProps = {
    shape: "polygon",
    points: [
      { x: "0mm", y: "0mm" },
      { x: "2mm", y: 0 },
      { x: 2, y: "1mm" },
      { x: 0, y: 1 },
    ],
    holes: [
      [
        { x: 0.5, y: 0.25 },
        { x: 1, y: 0.25 },
        { x: 1, y: 0.75 },
      ],
    ],
    pcbX: "5mm",
    pcbY: "-3mm",
    pcbRotation: "90deg",
    layer: "bottom",
  }
  expect(solderPasteProps.parse(aperture)).toEqual({
    shape: "polygon",
    holes: [
      [
        { x: 0.5, y: 0.25 },
        { x: 1, y: 0.25 },
        { x: 1, y: 0.75 },
      ],
    ],
    layer: "bottom",
    points: [
      { x: 0, y: 0 },
      { x: 2, y: 0 },
      { x: 2, y: 1 },
      { x: 0, y: 1 },
    ],
    pcbX: 5,
    pcbY: -3,
    pcbRotation: 90,
  })
  expect(
    polygonSolderPasteProps.parse({ shape: "polygon", points: aperture.points })
      .holes,
  ).toBeUndefined()
  expect(
    solderPasteProps.safeParse({
      shape: "polygon",
      points: aperture.points.slice(0, 2),
    }).success,
  ).toBe(false)
  expect(
    solderPasteProps.safeParse({ ...aperture, holes: [[{ x: 0, y: 0 }]] })
      .success,
  ).toBe(false)
  expect(
    solderPasteProps.parse({ shape: "rect", width: "1mm", height: "2mm" }),
  ).toMatchObject({ shape: "rect", width: 1, height: 2 })
  expect(
    solderPasteProps.parse({ shape: "circle", radius: "1mm" }),
  ).toMatchObject({ shape: "circle", radius: 1 })
})
