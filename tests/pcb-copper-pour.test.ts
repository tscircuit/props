import { expect, test } from "bun:test"
import { pcbCopperPourProps } from "../lib/components/pcb-copper-pour"

test("pcbcopperpour parses each supported precomputed shape", () => {
  expect(
    pcbCopperPourProps.parse({
      shape: "rect",
      layer: "top",
      width: "3mm",
      height: "4mm",
    }),
  ).toEqual({
    shape: "rect",
    layer: "top",
    width: 3,
    height: 4,
    coveredWithSolderMask: true,
  })

  expect(
    pcbCopperPourProps.parse({
      shape: "polygon",
      layer: "inner2",
      connectsTo: "net.GND",
      coveredWithSolderMask: false,
      pcbX: "1mm",
      pcbY: "2mm",
      pcbRotation: "90deg",
      points: [
        { x: -1, y: -1 },
        { x: 1, y: -1 },
        { x: 1, y: 1 },
      ],
    }),
  ).toEqual({
    shape: "polygon",
    layer: "inner2",
    connectsTo: "net.GND",
    coveredWithSolderMask: false,
    pcbX: 1,
    pcbY: 2,
    pcbRotation: 90,
    points: [
      { x: -1, y: -1 },
      { x: 1, y: -1 },
      { x: 1, y: 1 },
    ],
  })

  expect(
    pcbCopperPourProps.parse({
      shape: "brep",
      layer: "bottom",
      pcbX: "2mm",
      brepShape: {
        outer_ring: {
          vertices: [
            { x: 0, y: 0 },
            { x: 2, y: 0 },
            { x: 0, y: 2 },
          ],
        },
      },
    }),
  ).toEqual({
    shape: "brep",
    layer: "bottom",
    coveredWithSolderMask: true,
    pcbX: 2,
    brepShape: {
      outer_ring: {
        vertices: [
          { x: 0, y: 0 },
          { x: 2, y: 0 },
          { x: 0, y: 2 },
        ],
      },
      inner_rings: [],
    },
  })
})
