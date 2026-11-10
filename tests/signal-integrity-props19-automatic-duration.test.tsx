import { expect, test } from "bun:test"
import { pcbTransientChannelSimulationProps } from "lib"
import { simulation } from "./signal-integrity-fixtures"

test("duration absence stays automatic and extracted PDN stays schema-valid", () => {
  const block = (
    <simulation.pcbtransientchannelsimulation
      bitRate="20Mbps"
      pdn="extracted"
      duration={undefined}
    />
  )
  const parsed = pcbTransientChannelSimulationProps.parse(block.props)
  expect(parsed.pdn).toBe("extracted")
  expect(parsed).not.toHaveProperty("duration")
})
