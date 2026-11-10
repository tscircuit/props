import { expect, test } from "bun:test"
import { pcbTransientChannelSimulationProps } from "lib"
import { simulation } from "./signal-integrity-fixtures"

test("removed supply has neither an authoring type nor a runtime alias", () => {
  const block = (
    // @ts-expect-error Rails come from the selected IBIS models at the test corner.
    <simulation.pcbtransientchannelsimulation bitRate="20Mbps" supply="ibis" />
  )
  expect(
    pcbTransientChannelSimulationProps.safeParse(block.props).success,
  ).toBe(false)
  expect(
    pcbTransientChannelSimulationProps.safeParse({
      ...block.props,
      supply: "board",
    }).success,
  ).toBe(false)
})
