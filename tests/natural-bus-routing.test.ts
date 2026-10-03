import { expect, test } from "bun:test"
import type { RelativeRouteLength } from "lib/common/routeLength"
import { busProps, type BusProps } from "lib/components/bus"
import {
  differentialPairProps,
  type DifferentialPairProps,
} from "lib/components/differentialpair"

test("bus directly expresses matching, width-relative spacing and impedance range", () => {
  const raw = {
    name: "DATA0",
    connections: ["DQ0", "DQ1", "DM0"],
    lengthMatchTo: ".DQS0",
    maxLengthSkew: "25mil",
    maxLength: { reference: "longest_manhattan" },
    targetImpedance: { min: "50ohm", max: "75ohm" },
    pcbTraceSpacing: "3w",
    pcbExternalTraceSpacing: "4w",
    pcbReducedTraceSpacing: "1w",
    maxReducedSpacingLength: "1250mil",
  } satisfies BusProps
  expect(busProps.parse(raw)).toEqual({
    ...raw,
    maxLengthSkew: 0.635,
    targetImpedance: { min: 50, max: 75 },
    pcbTraceSpacing: { widthMultiplier: 3 },
    pcbExternalTraceSpacing: { widthMultiplier: 4 },
    pcbReducedTraceSpacing: { widthMultiplier: 1 },
    maxReducedSpacingLength: 31.75,
  })
})

test("command bus and clock pair share one length expression without a third element", () => {
  const targetLength = {
    reference: "longest_manhattan",
    of: [".COMMANDS", ".CLOCK"],
    offset: "300mil",
  } satisfies RelativeRouteLength
  const target = targetLength
  const bus = {
    name: "COMMANDS",
    connections: ["A0", "A1", "CS"],
    targetLength: target,
    lengthTolerance: "50mil",
  } satisfies BusProps
  const pair = {
    name: "CLOCK",
    positiveConnection: "CK_P",
    negativeConnection: "CK_N",
    targetLength: target,
    lengthTolerance: "50mil",
    maxLengthSkew: "5mil",
    targetDifferentialImpedance: { min: "100ohm", max: "150ohm" },
    pcbTraceGap: "0.12mm",
  } satisfies DifferentialPairProps
  const parsedBus = busProps.parse(bus),
    parsedPair = differentialPairProps.parse(pair)
  expect(parsedBus.targetLength).toEqual({ ...target, offset: 7.62 })
  expect(parsedPair.targetLength).toEqual(parsedBus.targetLength)
  expect(parsedPair.lengthTolerance).toBe(1.27)
  expect(parsedPair.maxLengthSkew).toBe(0.127)
  expect(parsedPair.targetDifferentialImpedance).toEqual({ min: 100, max: 150 })
  expect(parsedPair.pcbTraceGap).toBe(0.12)
})

test("existing scalar impedance and absolute lengths stay scalar after unit normalization", () => {
  expect(
    busProps.parse({
      connections: ["A"],
      targetImpedance: "60ohm",
      minLength: "10mm",
      maxLength: "20mm",
      pcbTraceSpacing: "0.3mm",
    }),
  ).toEqual({
    connections: ["A"],
    targetImpedance: 60,
    minLength: 10,
    maxLength: 20,
    pcbTraceSpacing: 0.3,
  })
  expect(
    differentialPairProps.parse({
      positiveConnection: "P",
      negativeConnection: "N",
      targetDifferentialImpedance: 120,
    }).targetDifferentialImpedance,
  ).toBe(120)
  expect(busProps.parse({ connections: ["A"] })).toEqual({ connections: ["A"] })
})

test("relative offsets stay explicit, including negative offsets and reordered equivalent references", () => {
  const raw = {
    connections: ["A"],
    minLength: {
      reference: "longest_manhattan",
      of: [".A", ".B"],
      offset: "-5mil",
    },
    maxLength: { reference: "longest_manhattan", of: [".B", ".A"], offset: 0 },
  }
  expect(busProps.parse(raw).minLength).toEqual({
    ...raw.minLength,
    offset: -0.127,
  })
  expect(
    busProps.safeParse({ ...raw, minLength: { ...raw.minLength, offset: 1 } })
      .success,
  ).toBe(false)
})

test("rejects incomplete relationships, impossible bounds and malformed width multiples", () => {
  const invalid = [
    { lengthMatchTo: ".STROBE" },
    { lengthMatchTo: [], maxLengthSkew: 0.1 },
    { minLength: 20, maxLength: 10 },
    { maxLength: -1 },
    { maxLength: Infinity },
    { targetLength: 20 },
    { lengthTolerance: 0.5 },
    { targetLength: 20, lengthTolerance: -1 },
    { targetLength: 20, lengthTolerance: 0.1, maxLength: 10 },
    { maxLength: { reference: "longest_manhattan", of: [] } },
    { maxLength: { reference: "unknown" } },
    { maxLength: { reference: "longest_manhattan", offset: NaN } },
    { targetImpedance: { min: 75, max: 50 } },
    { targetImpedance: { min: 0, max: 75 } },
    { pcbTraceSpacing: "0w" },
    { pcbTraceSpacing: "-3w" },
    { pcbTraceSpacing: "Infinityw" },
    { pcbTraceSpacing: "1e309w" },
    { pcbTraceSpacing: NaN },
    { pcbReducedTraceSpacing: "1w" },
    { maxReducedSpacingLength: 20 },
    { pcbReducedTraceSpacing: "1w", maxReducedSpacingLength: 20 },
    {
      pcbTraceSpacing: "3w",
      pcbReducedTraceSpacing: "4w",
      maxReducedSpacingLength: 20,
    },
    {
      pcbExternalTraceSpacing: "0.2mm",
      pcbReducedTraceSpacing: "0.3mm",
      maxReducedSpacingLength: 20,
    },
    {
      pcbExternalTraceSpacing: "4w",
      pcbReducedTraceSpacing: "1w",
      maxReducedSpacingLength: -1,
    },
  ]
  for (const props of invalid)
    expect(busProps.safeParse({ connections: ["A"], ...props }).success).toBe(
      false,
    )
  expect(
    differentialPairProps.safeParse({
      positiveConnection: "P",
      negativeConnection: "N",
      targetDifferentialImpedance: { min: 150, max: 100 },
    }).success,
  ).toBe(false)
})

test("mixed absolute and relative spacing remains deferred to actual local widths", () => {
  const parsed = busProps.parse({
    connections: ["A"],
    pcbTraceSpacing: "3w",
    pcbReducedTraceSpacing: "0.2mm",
    maxReducedSpacingLength: "5mm",
  })
  expect(parsed.pcbTraceSpacing).toEqual({ widthMultiplier: 3 })
  expect(parsed.pcbReducedTraceSpacing).toBe(0.2)
  // Three widths may be above or below 0.2 mm; props cannot decide without copper geometry.
})
