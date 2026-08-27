import { expect, test } from "bun:test"
import { antennaProps, type AntennaProps } from "lib"

test("accepts a pcbPath using trace path syntax", () => {
  const raw: AntennaProps = {
    name: "ANT1",
    footprint: "0402",
    pcbX: "5mm",
    pcbY: -2,
    pcbPath: [
      "U1.1",
      { x: 0, y: 0 },
      { x: 1, y: 2, via: true, toLayer: "bottom" },
      { x: 3, y: 4 },
    ],
  }

  expect(antennaProps.parse(raw)).toEqual({
    name: "ANT1",
    footprint: "0402",
    pcbX: 5,
    pcbY: -2,
    pcbPath: [
      "U1.1",
      { x: 0, y: 0 },
      { x: 1, y: 2, via: true, toLayer: "bottom" },
      { x: 3, y: 4 },
    ],
  })
})

test("applies trace pcbPath via validation", () => {
  expect(() =>
    antennaProps.parse({
      name: "ANT1",
      pcbPath: [{ x: 0, y: 0, via: true }],
    }),
  ).toThrow("toLayer is required when via is true")
})

test("requires a component name", () => {
  expect(() => antennaProps.parse({ footprint: "0402" })).toThrow()
})
