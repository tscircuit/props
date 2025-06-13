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
  }
  const parsed = testpointProps.parse(rawProps)
  expect(parsed.footprintVariant).toBeUndefined()
  expect(parsed.padDiameter).toBe(1)
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
  }
  const parsed = testpointProps.parse(rawProps)
  expect(parsed.footprintVariant).toBe("through_hole")
  expect(parsed.holeDiameter).toBe(1)
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
