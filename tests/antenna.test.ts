import { expect, test } from "bun:test"
import {
  antennaFrequencyBands,
  antennaProps,
  antennaShapes,
  antennaWirelessStandards,
  type AntennaProps,
} from "lib"

test("accepts supported antenna design intent", () => {
  for (const antennaShape of antennaShapes) {
    expect(
      antennaProps.parse({ name: "ANT1", antennaShape }).antennaShape,
    ).toBe(antennaShape)
  }

  for (const wirelessStandard of antennaWirelessStandards) {
    expect(
      antennaProps.parse({ name: "ANT1", wirelessStandard }).wirelessStandard,
    ).toBe(wirelessStandard)
  }

  for (const frequencyBand of antennaFrequencyBands) {
    expect(
      antennaProps.parse({ name: "ANT1", frequencyBand }).frequencyBand,
    ).toBe(frequencyBand)
  }
})

test("rejects unknown antenna design intent", () => {
  expect(() =>
    antennaProps.parse({ name: "ANT1", antennaShape: "chip" }),
  ).toThrow()
  expect(() =>
    antennaProps.parse({ name: "ANT1", wirelessStandard: "zigbee" }),
  ).toThrow()
  expect(() =>
    antennaProps.parse({ name: "ANT1", frequencyBand: "900mhz" }),
  ).toThrow()
})

test("does not assume antenna design intent", () => {
  const parsed = antennaProps.parse({ name: "ANT1" })

  expect(parsed.antennaShape).toBeUndefined()
  expect(parsed.wirelessStandard).toBeUndefined()
  expect(parsed.frequencyBand).toBeUndefined()
})

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
