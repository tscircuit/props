import { expect, test } from "bun:test"
import { breakoutProps, type BreakoutProps } from "../lib/components/breakout"
import {
  breakoutPointProps,
  type BreakoutPointProps,
} from "../lib/components/breakoutpoint"

test("should parse breakout props with padding", () => {
  const raw: BreakoutProps = {
    name: "bo",
    padding: 1,
    paddingLeft: "2mm",
  }

  const parsed = breakoutProps.parse(raw)
  expect(parsed.padding).toBe(1)
  expect(parsed.paddingLeft).toBe(2)
})

test("breakout and fanout elements default to the fanout autorouter", () => {
  expect(breakoutProps.parse({}).autorouter).toBe("fanout")
  expect(
    breakoutProps.parse({ autorouter: "single_layer_fanout" }).autorouter,
  ).toBe("single_layer_fanout")
})

test("breakout accepts scalar fanout boundary padding", () => {
  const raw = {
    fanoutBoundaryPadding: "0.6mm",
  } satisfies BreakoutProps

  expect(breakoutProps.parse(raw).fanoutBoundaryPadding).toBe(0.6)
})

test("breakout accepts directional fanout boundary padding", () => {
  const raw = {
    fanoutBoundaryPadding: {
      top: "0.4mm",
      right: 0.8,
      bottom: "1.2mm",
    },
  } satisfies BreakoutProps

  expect(breakoutProps.parse(raw).fanoutBoundaryPadding).toEqual({
    top: 0.4,
    right: 0.8,
    bottom: 1.2,
  })
})

test("breakout rejects negative fanout boundary padding", () => {
  expect(() =>
    breakoutProps.parse({ fanoutBoundaryPadding: "-0.1mm" }),
  ).toThrow("Fanout boundary padding cannot be negative")
})

test("should parse breakout point props", () => {
  const raw: BreakoutPointProps = {
    pcbX: 5,
    pcbY: "2mm",
    connection: ".R1 > .pin1",
  }

  const parsed = breakoutPointProps.parse(raw)
  expect(parsed.pcbX).toBe(5)
  expect(parsed.pcbY).toBe(2)
  expect(parsed.connection).toBe(".R1 > .pin1")
})

test("should parse breakout point offsets and position mode", () => {
  const raw = {
    pcbOffsetX: 1,
    pcbOffsetY: "3mm",
    pcbPositionMode: "relative_to_board_anchor" as const,
    connection: ".R2 > .pin1",
  }

  const parsed = breakoutPointProps.parse(raw)
  expect(parsed.pcbOffsetX).toBe(1)
  expect(parsed.pcbOffsetY).toBeCloseTo(3)
  expect(parsed.pcbPositionMode).toBe("relative_to_board_anchor")
})
