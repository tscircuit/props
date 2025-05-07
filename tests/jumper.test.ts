import { expect, test } from "bun:test"
import { jumperProps, type JumperProps } from "lib/components/jumper"

// Test 2-pin jumper, pins 1-2 bridged
// Test 3-pin jumper, pins 1-2 bridged
// Test 3-pin jumper, pins 2-3 bridged
// Test 3-pin jumper, no bridgedPins
// Test 3-pin jumper, two bridges
// Test invalid bridgedPins (should fail)

test("should parse 2-pin jumper with pins 1-2 bridged", () => {
  const rawProps: JumperProps = {
    name: "jumper",
    pinCount: 2,
    bridgedPins: [[1, 2]],
  }
  const parsed = jumperProps.parse(rawProps)
  expect(parsed.pinCount).toBe(2)
  expect(parsed.bridgedPins).toEqual([[1, 2]])
})

test("should parse 3-pin jumper with pins 1-2 bridged", () => {
  const rawProps: JumperProps = {
    name: "jumper",
    pinCount: 3,
    bridgedPins: [[1, 2]],
  }
  const parsed = jumperProps.parse(rawProps)
  expect(parsed.pinCount).toBe(3)
  expect(parsed.bridgedPins).toEqual([[1, 2]])
})

test("should parse 3-pin jumper with pins 2-3 bridged", () => {
  const rawProps: JumperProps = {
    name: "jumper",
    pinCount: 3,
    bridgedPins: [[2, 3]],
  }
  const parsed = jumperProps.parse(rawProps)
  expect(parsed.pinCount).toBe(3)
  expect(parsed.bridgedPins).toEqual([[2, 3]])
})

test("should parse 3-pin jumper with no bridgedPins", () => {
  const rawProps: JumperProps = {
    name: "jumper",
    pinCount: 3,
  }
  const parsed = jumperProps.parse(rawProps)
  expect(parsed.pinCount).toBe(3)
  expect(parsed.bridgedPins).toBeUndefined()
})

test("should parse 3-pin jumper with two bridges", () => {
  const rawProps: JumperProps = {
    name: "jumper",
    pinCount: 3,
    bridgedPins: [
      [1, 2],
      [2, 3],
    ],
  }
  const parsed = jumperProps.parse(rawProps)
  expect(parsed.pinCount).toBe(3)
  expect(parsed.bridgedPins).toEqual([
    [1, 2],
    [2, 3],
  ])
})

test("should fail for invalid bridgedPins (not an array of tuples)", () => {
  expect(() =>
    jumperProps.parse({
      name: "jumper",
      pinCount: 3,
      bridgedPins: [1] as any, // invalid
    }),
  ).toThrow()
})
