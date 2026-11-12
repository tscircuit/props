import { expect, test } from "bun:test"
import { pcbTransientChannelSimulationProps, pcbChannelProps } from "lib"
import { data } from "./signal-integrity-fixtures"

test("parses bit rates as bit/s", () => {
  for (const [bitRate, expected] of [
    ["20Mbps", 20e6],
    ["250kbps", 250e3],
    [20e6, 20e6],
    ["1.6Gbps", 1.6e9],
    ["2e7bit/s", 20e6],
  ] as const) {
    expect(pcbTransientChannelSimulationProps.parse({ bitRate }).bitRate).toBe(
      expected,
    )
    expect(pcbChannelProps.parse({ ...data, bitRate }).bitRate).toBe(expected)
  }
})
