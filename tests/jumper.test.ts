import { expect, test } from "bun:test"
import { jumperProps, type JumperProps } from "lib/components/jumper"

// Test 2-pin jumper, pins 1-2 internally connected
// Test 3-pin jumper, pins 1-2 internally connected
// Test 3-pin jumper, pins 2-3 internally connected
// Test 3-pin jumper, no internallyConnectedPins
// Test 3-pin jumper, two bridges (1-2 and 2-3)
// Test invalid internallyConnectedPins (not an array of arrays)

test("should parse 2-pin jumper with pins 1-2 internally connected", () => {
  const rawProps: JumperProps = {
    name: "jumper",
    pinCount: 2,
    internallyConnectedPins: [["1", "2"]],
  }
  const parsed = jumperProps.parse(rawProps)
  expect(parsed.pinCount).toBe(2)
  expect(parsed.internallyConnectedPins).toEqual([["1", "2"]])
})

test("should parse 3-pin jumper with pins 1-2 internally connected", () => {
  const rawProps: JumperProps = {
    name: "jumper",
    pinCount: 3,
    internallyConnectedPins: [["1", "2"]],
  }
  const parsed = jumperProps.parse(rawProps)
  expect(parsed.pinCount).toBe(3)
  expect(parsed.internallyConnectedPins).toEqual([["1", "2"]])
})

test("should parse 3-pin jumper with pins 2-3 internally connected", () => {
  const rawProps: JumperProps = {
    name: "jumper",
    pinCount: 3,
    internallyConnectedPins: [["2", "3"]],
  }
  const parsed = jumperProps.parse(rawProps)
  expect(parsed.pinCount).toBe(3)
  expect(parsed.internallyConnectedPins).toEqual([["2", "3"]])
})

test("should parse 3-pin jumper with no internallyConnectedPins", () => {
  const rawProps: JumperProps = {
    name: "jumper",
    pinCount: 3,
  }
  const parsed = jumperProps.parse(rawProps)
  expect(parsed.pinCount).toBe(3)
  expect(parsed.internallyConnectedPins).toBeUndefined()
})

test("should parse 3-pin jumper with two bridges (1-2 and 2-3)", () => {
  const rawProps: JumperProps = {
    name: "jumper",
    pinCount: 3,
    internallyConnectedPins: [
      ["1", "2"],
      ["2", "3"],
    ],
  }
  const parsed = jumperProps.parse(rawProps)
  expect(parsed.pinCount).toBe(3)
  expect(parsed.internallyConnectedPins).toEqual([
    ["1", "2"],
    ["2", "3"],
  ])
})

test("should fail for invalid internallyConnectedPins (not an array of arrays)", () => {
  expect(() =>
    jumperProps.parse({
      name: "jumper",
      pinCount: 3,
      internallyConnectedPins: [1] as any, // invalid
    }),
  ).toThrow()
})

test("should parse jumper props with single string connections", () => {
  const rawProps: JumperProps = {
    name: "jumper",
    pinCount: 2,
    connections: {
      1: "net.VCC",
      2: "net.GND",
    },
  }
  const parsed = jumperProps.parse(rawProps)
  expect(parsed.connections).toEqual({
    1: "net.VCC",
    2: "net.GND",
  })
})

test("should parse jumper props with array connections", () => {
  const rawProps: JumperProps = {
    name: "jumper",
    pinCount: 3,
    connections: {
      1: ["net.VCC", "net.POWER"],
      2: ["net.GND"],
    },
  }
  const parsed = jumperProps.parse(rawProps)
  expect(parsed.connections).toEqual({
    1: ["net.VCC", "net.POWER"],
    2: ["net.GND"],
  })
})

test("should allow optional connections", () => {
  const rawProps: JumperProps = {
    name: "jumper",
    pinCount: 2,
  }
  const parsed = jumperProps.parse(rawProps)
  expect(parsed.connections).toBeUndefined()
})
