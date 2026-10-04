import { expect, test } from "bun:test"
import { pcbCopperPourProps } from "../lib/components/pcb-copper-pour"

test("pcbcopperpour accepts a net selector for precomputed geometry", () => {
  expect(
    pcbCopperPourProps.parse({
      shape: "polygon",
      layer: "inner2",
      connectsTo: "net.GND",
      points: [
        { x: -1, y: -1 },
        { x: 1, y: -1 },
        { x: 1, y: 1 },
      ],
    }),
  ).toMatchObject({
    shape: "polygon",
    layer: "inner2",
    connectsTo: "net.GND",
  })
})
