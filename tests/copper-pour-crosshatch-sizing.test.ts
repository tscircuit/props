import { expect, test } from "bun:test"
import { copperPourProps } from "../lib/components/copper-pour"

test("crosshatch sizing parses distances and validates enabled mesh dimensions", () => {
  const pour = { layer: "top", connectsTo: "net.GND", crosshatch: true }
  expect(copperPourProps.parse(pour).crosshatchPitch).toBeUndefined()
  expect(copperPourProps.parse(pour).crosshatchWidth).toBeUndefined()
  expect(
    copperPourProps.parse({
      ...pour,
      crosshatchPitch: "2mm",
      crosshatchWidth: "500um",
    }),
  ).toMatchObject({ crosshatchPitch: 2, crosshatchWidth: 0.5 })
  expect(
    copperPourProps.parse({
      ...pour,
      crosshatchPitch: 2,
      crosshatchWidth: 0.5,
    }),
  ).toMatchObject({ crosshatchPitch: 2, crosshatchWidth: 0.5 })
  for (const prop of ["crosshatchPitch", "crosshatchWidth"]) {
    for (const value of [0, -1, Infinity, NaN, "-1mm", "invalid"]) {
      expect(
        copperPourProps.safeParse({ ...pour, [prop]: value }).success,
      ).toBe(false)
    }
  }
  for (const sizing of [
    { crosshatchPitch: 0.2 },
    { crosshatchWidth: 1 },
    { crosshatchPitch: 2, crosshatchWidth: 2 },
    { crosshatchPitch: 2, crosshatchWidth: 3 },
  ]) {
    expect(copperPourProps.safeParse({ ...pour, ...sizing }).success).toBe(
      false,
    )
    // Dimensions do not enable hatching or constrain a solid fill.
    expect(
      copperPourProps.safeParse({ ...pour, ...sizing, crosshatch: false })
        .success,
    ).toBe(true)
  }
})
