import { expect, test } from "bun:test"
import {
  solderjumperProps,
  type SolderJumperProps,
} from "lib/components/solderjumper"

test("should parse solderjumper with bridged pins", () => {
  const rawProps: SolderJumperProps = {
    name: "solderjumper",
    bridgedPins: [["1", "2"]],
  }
  const parsed = solderjumperProps.parse(rawProps)
  expect(parsed.bridgedPins).toEqual([["1", "2"]])
})

test("should parse solderjumper without bridged pins", () => {
  const rawProps: SolderJumperProps = {
    name: "solderjumper",
  }
  const parsed = solderjumperProps.parse(rawProps)
  expect(parsed.bridgedPins).toBeUndefined()
})

test("should parse solderjumper with multiple bridges", () => {
  const rawProps: SolderJumperProps = {
    name: "solderjumper",
    bridgedPins: [
      ["1", "2"],
      ["2", "3"],
    ],
  }
  const parsed = solderjumperProps.parse(rawProps)
  expect(parsed.bridgedPins).toEqual([
    ["1", "2"],
    ["2", "3"],
  ])
})

test("should parse solderjumper with all pins bridged", () => {
  const rawProps: SolderJumperProps = {
    name: "solderjumper",
    bridged: true,
  }
  const parsed = solderjumperProps.parse(rawProps)
  expect(parsed.bridged).toBe(true)
})

test("should parse solderjumper with bridged set to false", () => {
  const rawProps: SolderJumperProps = {
    name: "solderjumper",
    bridged: false,
  }
  const parsed = solderjumperProps.parse(rawProps)
  expect(parsed.bridged).toBe(false)
})

test("should fail for invalid bridgedPins", () => {
  expect(() =>
    solderjumperProps.parse({
      name: "solderjumper",
      bridgedPins: [1] as any,
    }),
  ).toThrow()
})
