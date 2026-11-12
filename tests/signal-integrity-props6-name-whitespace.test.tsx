import { expect, test } from "bun:test"
import { pcbTransientChannelSimulationProps, pcbChannelProps } from "lib"
import { simulation, data } from "./signal-integrity-fixtures"

test("channel and block names trim whitespace and reject blank text", () => {
  for (const name of ["", " \t\n ", " \tDATA\n "]) {
    const signal = <simulation.pcbchannel {...data} name={name} />
    const block = (
      <simulation.pcbtransientchannelsimulation bitRate="20Mbps" name={name} />
    )
    for (const parsed of [
      pcbChannelProps.safeParse(signal.props),
      pcbTransientChannelSimulationProps.safeParse(block.props),
    ]) {
      expect(parsed.success).toBe(name.trim().length > 0)
      if (parsed.success) expect(parsed.data.name).toBe(name.trim())
    }
  }
})
