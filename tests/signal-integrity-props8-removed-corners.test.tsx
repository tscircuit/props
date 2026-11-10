import { expect, test } from "bun:test"
import {
  pcbTransientChannelSimulationProps,
  type PcbTransientChannelSimulationProps,
} from "lib"
import { simulation } from "./signal-integrity-fixtures"

test("rejects removed corners", () => {
  for (const corner of ["typ", "min", "max"]) {
    // @ts-expect-error Abbreviated corners are removed from the authoring API.
    const invalidCorner: PcbTransientChannelSimulationProps["corner"] = corner
    const block = (
      <simulation.pcbtransientchannelsimulation
        bitRate="20Mbps"
        corner={invalidCorner}
      />
    )
    expect(
      pcbTransientChannelSimulationProps.safeParse(block.props).success,
    ).toBe(false)
  }
})
