import { expect, test } from "bun:test"
import {
  chipProps,
  commonComponentProps,
  crystalProps,
  mountedboardProps,
  resistorProps,
  resolveManufacturerPartNumber,
  type ChipProps,
  type MountedBoardProps,
} from "../lib"

test("component schemas retain mpn and consumers resolve it canonically", () => {
  const chip: ChipProps = { name: "U1", mpn: "TMP117" }
  const mountedboard: MountedBoardProps = { name: "M1", mpn: "CM5" }
  for (const parsed of [
    commonComponentProps.parse(chip),
    chipProps.parse(chip),
    resistorProps.parse({ ...chip, resistance: "10k" }),
    crystalProps.parse({
      ...chip,
      frequency: "16MHz",
      loadCapacitance: "10pF",
    }),
    mountedboardProps.parse(mountedboard),
  ]) {
    expect(parsed.mpn).toBeDefined()
    expect(resolveManufacturerPartNumber(parsed)).toBe(parsed.mpn)
  }
})

test("supports existing names, matching aliases, and missing part numbers", () => {
  for (const alias of ["mpn", "mfn", "manufacturerPartNumber"] as const) {
    expect(resolveManufacturerPartNumber({ [alias]: " TMP117 " })).toBe(
      "TMP117",
    )
  }
  expect(
    resolveManufacturerPartNumber({
      manufacturerPartNumber: "TMP117",
      mpn: "TMP117",
      mfn: "TMP117",
    }),
  ).toBe("TMP117")
  expect(resolveManufacturerPartNumber({})).toBeUndefined()
  expect(resolveManufacturerPartNumber({ mpn: " ", mfn: "" })).toBeUndefined()
  expect(resolveManufacturerPartNumber({ mpn: " ", mfn: "TMP117" })).toBe(
    "TMP117",
  )
})

test("rejects conflicting manufacturer part number aliases", () => {
  expect(() =>
    resolveManufacturerPartNumber({
      manufacturerPartNumber: "TMP117",
      mpn: "TMP116",
    }),
  ).toThrow("Conflicting manufacturerPartNumber, mpn, and mfn")
  expect(() =>
    resolveManufacturerPartNumber({ mpn: "TMP117", mfn: "TMP116" }),
  ).toThrow("Conflicting manufacturerPartNumber, mpn, and mfn")
})
