import { expect, test } from "bun:test"
import { pcbTransientChannelSimulationProps } from "lib"
import { simulation } from "./signal-integrity-fixtures"

test("duration absence stays automatic", () => {
  const block = (
    <simulation.pcbtransientchannelsimulation
      bitRate="20Mbps"
      duration={undefined}
    />
  )
  const parsed = pcbTransientChannelSimulationProps.parse(block.props)
  expect(parsed).not.toHaveProperty("duration")
})
