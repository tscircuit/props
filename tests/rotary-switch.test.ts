import { expect, test } from "bun:test"
import {
  type RotarySwitchProps,
  rotarySwitchProps,
} from "../lib/components/rotary-switch"

test("parses rotaryswitch props with explicit poles, positions, and simPosition", () => {
  const noConnect = ["pin12"] as const
  const rawProps: RotarySwitchProps = {
    name: "SW1",
    poles: 4,
    positions: 3,
    simPosition: 2,
    manufacturerPartNumber: "SR2611F-0403",
    pinLabels: {
      pin13: "DECK1_COM",
      pin1: "DECK1_POS1",
    },
    noConnect,
    connections: {
      pin13: "net.IN1",
      pin2: "net.OUT1",
    },
  }

  const parsed = rotarySwitchProps.parse(rawProps)
  expect(parsed.poles).toBe(4)
  expect(parsed.positions).toBe(3)
  expect(parsed.simPosition).toBe(2)
  expect(parsed.noConnect).toEqual(["pin12"])
  expect(parsed.connections?.pin13).toBe("net.IN1")
})

test("defaults poles to 1 when omitted", () => {
  const parsed = rotarySwitchProps.parse({
    name: "SW1",
    positions: 12,
  })
  expect(parsed.poles).toBe(1)
  expect(parsed.positions).toBe(12)
  expect(parsed.simPosition).toBeUndefined()
})

test("rejects invalid poles, positions, and out-of-range simPosition", () => {
  expect(
    rotarySwitchProps.safeParse({
      name: "SW1",
      poles: 0,
      positions: 3,
    }).success,
  ).toBe(false)

  expect(
    rotarySwitchProps.safeParse({
      name: "SW1",
      poles: 2,
      positions: 1,
    }).success,
  ).toBe(false)

  expect(
    rotarySwitchProps.safeParse({
      name: "SW1",
      poles: 4,
      positions: 3,
      simPosition: 0,
    }).success,
  ).toBe(false)

  expect(() =>
    rotarySwitchProps.parse({
      name: "SW1",
      poles: 4,
      positions: 3,
      simPosition: 4,
    }),
  ).toThrow("simPosition (4) cannot exceed positions (3)")
})
