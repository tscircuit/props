import { expect, test } from "bun:test"
import {
  testpointProps,
  type TestpointProps,
} from "../lib/components/testpoint"
import { z } from "zod"

test("should parse smd testpoint", () => {
  const rawProps: TestpointProps = {
    name: "tp1",
    diameter: 1,
  }
  const parsed = testpointProps.parse(rawProps)
  expect(parsed.variant).toBe("smd")
  expect(parsed.diameter).toBe(1)
  expect(parsed.holeDiameter).toBeUndefined()
})

test("should parse smd testpoint without diameter", () => {
  const rawProps: TestpointProps = {
    name: "tp0",
  }
  const parsed = testpointProps.parse(rawProps)
  expect(parsed.variant).toBe("smd")
  expect(parsed.diameter).toBeUndefined()
})

test("should parse through_hole testpoint", () => {
  const rawProps: TestpointProps = {
    name: "tp2",
    variant: "through_hole",
    diameter: 2,
    holeDiameter: 1,
  }
  const parsed = testpointProps.parse(rawProps)
  expect(parsed.variant).toBe("through_hole")
  expect(parsed.holeDiameter).toBe(1)
})

test("should require holeDiameter for through_hole variant", () => {
  expect(() =>
    testpointProps.parse({
      name: "tp3",
      variant: "through_hole",
      diameter: 2,
    } as TestpointProps),
  ).toThrow(z.ZodError)
})
