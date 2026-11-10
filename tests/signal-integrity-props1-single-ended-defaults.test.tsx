import { expect, test } from "bun:test"
import { simulation, parseBlock } from "./signal-integrity-fixtures"

test("Level 1 single-ended TSX supplies the RFC defaults", () => {
  const { block, signals } = parseBlock(
    <simulation.pcbtransientchannelsimulation bitRate="20Mbps">
      <simulation.pcbchannel
        name="DATA"
        driverRef=".TX > .Y"
        receiverRef=".RX > .A"
      />
    </simulation.pcbtransientchannelsimulation>,
  )
  expect(block).toMatchObject({
    bitRate: 20e6,
    corner: "typical",
    unlistedNets: "passive",
    unrouted: "error",
    pdn: "ideal",
  })
  expect(block).not.toHaveProperty("duration")
  expect(block).not.toHaveProperty("supply")
  expect(signals).toEqual([
    {
      name: "DATA",
      driverRef: ".TX > .Y",
      receiverRef: ".RX > .A",
      pattern: "prbs7",
      offset: "0UI",
      probe: "local",
    },
  ])
})
