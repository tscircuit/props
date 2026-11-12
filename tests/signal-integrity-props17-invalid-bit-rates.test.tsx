import { expect, test } from "bun:test"
import { pcbTransientChannelSimulationProps, pcbChannelProps } from "lib"
import { data } from "./signal-integrity-fixtures"

test("rejects invalid bit rates", () => {
  for (const bitRate of [0, -1, Infinity, NaN, "20MHz", "20MBps", "garbage"]) {
    expect(
      pcbTransientChannelSimulationProps.safeParse({ bitRate }).success,
    ).toBe(false)
    expect(pcbChannelProps.safeParse({ ...data, bitRate }).success).toBe(false)
  }
})
