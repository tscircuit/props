import { expect, test } from "bun:test"
import { pcbTransientChannelSimulationProps } from "lib"
import { simulation } from "./signal-integrity-fixtures"

test("accepts the spelled-out corners", () => {
  for (const corner of ["typical", "minimum", "maximum"] as const) {
    const block = (
      <simulation.pcbtransientchannelsimulation
        bitRate="20Mbps"
        corner={corner}
      />
    )
    expect(pcbTransientChannelSimulationProps.parse(block.props).corner).toBe(
      corner,
    )
  }
})
