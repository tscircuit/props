import { expect, test } from "bun:test"
import { pcbTransientChannelSimulationProps, pcbChannelProps } from "lib"
import { data } from "./signal-integrity-fixtures"

test("block rate is required and numerical extraction settings are not props", () => {
  expect(pcbTransientChannelSimulationProps.safeParse({}).success).toBe(false)
  expect(
    pcbTransientChannelSimulationProps.safeParse({ bitRate: 20e6, sections: 4 })
      .success,
  ).toBe(false)
  expect(
    pcbChannelProps.safeParse({ ...data, termination: "120ohm" }).success,
  ).toBe(false)
})
