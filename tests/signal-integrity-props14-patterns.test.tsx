import { expect, test } from "bun:test"
import { pcbChannelProps } from "lib"
import { simulation, data } from "./signal-integrity-fixtures"

test("patterns are open strings, including constant quiet signals", () => {
  for (const pattern of [
    "prbs7",
    "prbs15",
    "prbs31",
    "clock",
    "0011010",
    "0",
    "1",
    "custom",
    "prbs-custom",
  ]) {
    const signal = <simulation.pcbchannel {...data} pattern={` ${pattern} `} />
    expect(pcbChannelProps.parse(signal.props).pattern).toBe(pattern)
  }
  expect(
    pcbChannelProps.parse({ ...data, pattern: "prbs-custom", seed: 0 }).seed,
  ).toBe(0)
})
