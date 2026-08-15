import { expect, test } from "bun:test"
import { expectTypeOf } from "expect-type"
import {
  type CopperPourProps,
  copperPourProps,
} from "lib/components/copper-pour"

test("should parse a valid copper pour", () => {
  const rawProps: CopperPourProps = {
    connectsTo: "gnd",
    layer: "top",
  }
  const parsed = copperPourProps.parse(rawProps)

  expect(parsed.connectsTo).toBe("gnd")
  expect(parsed.layer).toBe("top")
  expect(parsed.coveredWithSolderMask).toBe(true)
})

test("type inference for CopperPourProps", () => {
  const props: CopperPourProps = {
    connectsTo: "gnd",
    layer: "bottom",
    padMargin: 1,
    coveredWithSolderMask: true,
  }
  expectTypeOf(props).toMatchTypeOf<CopperPourProps>()
})

test("should parse coveredWithSolderMask when true", () => {
  const rawProps: CopperPourProps = {
    connectsTo: "gnd",
    layer: "top",
    coveredWithSolderMask: true,
  }

  const parsed = copperPourProps.parse(rawProps)

  expect(parsed.coveredWithSolderMask).toBe(true)
})

test("should parse clearance", () => {
  const rawProps: CopperPourProps = {
    connectsTo: "gnd",
    layer: "top",
    clearance: "0.5mm",
  }

  const parsed = copperPourProps.parse(rawProps)

  expect(parsed.clearance).toBe(0.5)
})

test("should parse boardEdgeMargin", () => {
  const rawProps: CopperPourProps = {
    connectsTo: "gnd",
    layer: "top",
    boardEdgeMargin: "1mm",
  }

  const parsed = copperPourProps.parse(rawProps)

  expect(parsed.boardEdgeMargin).toBe(1)
})

test("should parse cutoutMargin", () => {
  const rawProps: CopperPourProps = {
    connectsTo: "gnd",
    layer: "top",
    cutoutMargin: "2mm",
  }

  const parsed = copperPourProps.parse(rawProps)

  expect(parsed.cutoutMargin).toBe(2)
})

test("should parse thermalRelief", () => {
  const rawProps: CopperPourProps = {
    connectsTo: "gnd",
    layer: "top",
    thermalRelief: {
      spokeWidth: "0.3mm",
      spokeCount: 4,
    },
  }

  const parsed = copperPourProps.parse(rawProps)

  expect(parsed.thermalRelief).toEqual({
    spokeWidth: 0.3,
    spokeCount: 4,
  })
})

test("should reject invalid thermalRelief spoke counts", () => {
  expect(() =>
    copperPourProps.parse({
      connectsTo: "gnd",
      layer: "top",
      thermalRelief: {
        spokeWidth: "0.3mm",
        spokeCount: 3.5,
      },
    }),
  ).toThrow()
})

test("should reject invalid thermalRelief spoke widths", () => {
  expect(() =>
    copperPourProps.parse({
      connectsTo: "gnd",
      layer: "top",
      thermalRelief: {
        spokeWidth: "0mm",
        spokeCount: 4,
      },
    }),
  ).toThrow()
})

test("should parse unbroken", () => {
  const rawProps: CopperPourProps = {
    connectsTo: "gnd",
    layer: "top",
    unbroken: true,
  }

  const parsed = copperPourProps.parse(rawProps)

  expect(parsed.unbroken).toBe(true)
})
