import { expect, test } from "bun:test"
import { pcbChannelProps } from "lib"
import { simulation, data } from "./signal-integrity-fixtures"

test("rejects removed props even alongside valid selectors", () => {
  for (const prop of [
    "driver",
    "receiver",
    "strobe",
    "strobeRef",
    "mask",
    "setup",
    "hold",
    "thresholds",
  ]) {
    const signal = <simulation.pcbchannel {...data} {...{ [prop]: ".OLD" }} />
    expect(pcbChannelProps.safeParse(signal.props).success).toBe(false)
  }
})
