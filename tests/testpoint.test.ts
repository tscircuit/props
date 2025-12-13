import { expect, test } from "bun:test"
import {
  testpointProps,
  type TestpointProps,
} from "../lib/components/testpoint"
import { z } from "zod"

test("should parse pad testpoint", () => {
  const rawProps: TestpointProps = {
    name: "tp1",
    padDiameter: 1,
    connectsTo: "GND",
  }
  const parsed = testpointProps.parse(rawProps)
  expect(parsed.footprintVariant).toBeUndefined()
  expect(parsed.padDiameter).toBe(1)
  expect(parsed.connectsTo).toBe("GND")
  expect(parsed.holeDiameter).toBeUndefined()
})

test("should parse pad testpoint without padDiameter", () => {
  const rawProps: TestpointProps = {
    name: "tp0",
  }
  const parsed = testpointProps.parse(rawProps)
  expect(parsed.footprintVariant).toBeUndefined()
  expect(parsed.padDiameter).toBeUndefined()
})

test("should parse through_hole testpoint", () => {
  const rawProps: TestpointProps = {
    name: "tp2",
    footprintVariant: "through_hole",
    padDiameter: 2,
    holeDiameter: 1,
    connections: {
      pin1: ".U1 > .pin1",
    },
  }
  const parsed = testpointProps.parse(rawProps)
  expect(parsed.footprintVariant).toBe("through_hole")
  expect(parsed.holeDiameter).toBe(1)
  expect(parsed.connections?.pin1).toBe(".U1 > .pin1")
})

test("should parse connectsTo as string array", () => {
  const rawProps: TestpointProps = {
    name: "tp-array",
    connectsTo: ["GND", "TP_BUS"],
  }
  const parsed = testpointProps.parse(rawProps)
  expect(parsed.connectsTo).toEqual(["GND", "TP_BUS"])
})

test("should require holeDiameter for through_hole variant", () => {
  expect(() =>
    testpointProps.parse({
      name: "tp3",
      footprintVariant: "through_hole",
      padDiameter: 2,
    } as TestpointProps),
  ).toThrow(z.ZodError)
})

test("should require pin1 connection when connections provided", () => {
  expect(() =>
    testpointProps.parse({
      name: "tp4",
      connections: {} as TestpointProps["connections"],
    }),
  ).toThrow(z.ZodError)
})

test("should reject unknown connection labels", () => {
  expect(() =>
    testpointProps.parse({
      name: "tp5",
      connections: {
        pin1: ".U1 > .pin1",
        pin2: ".U1 > .pin2",
      } as unknown as TestpointProps["connections"],
    }),
  ).toThrow(z.ZodError)
})
