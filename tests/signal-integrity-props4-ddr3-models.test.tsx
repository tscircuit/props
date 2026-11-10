import { expect, test } from "bun:test"
import { simulation, parseBlock } from "./signal-integrity-fixtures"

test("RFC DDR3 write TSX supplies per-leg models and a half-UI offset", () => {
  const { signals } = parseBlock(
    <simulation.pcbtransientchannelsimulation
      name="WRITE"
      bitRate="800Mbps"
      corner="typical"
      pdn="ideal"
      unrouted="ideal"
    >
      <simulation.pcbchannel
        name="DQS"
        driverRef={{
          pin: { p: ".CPU > .DDR_DQS0", n: ".CPU > .DDR_DQSN0" },
          model: { p: "Model_579", n: "Model_771" },
        }}
        receiverRef={{
          pin: { p: ".DRAM > .DQSL", n: ".DRAM > .DQSL_N" },
          model: { p: "ODT_off", n: "ODT_off" },
        }}
        pattern="clock"
        offset="0.5UI"
      />
      <simulation.pcbchannel
        name="DQ0"
        driverRef={{ pin: ".CPU > .DDR_D0", model: "Model_257" }}
        receiverRef={{ pin: ".DRAM > .DQL0", model: "ODT_off" }}
      />
    </simulation.pcbtransientchannelsimulation>,
  )
  expect(signals[0]).toMatchObject({
    pattern: "clock",
    offset: "0.5UI",
    driverRef: {
      pin: { p: ".CPU > .DDR_DQS0", n: ".CPU > .DDR_DQSN0" },
      model: { p: "Model_579", n: "Model_771" },
    },
    receiverRef: {
      pin: { p: ".DRAM > .DQSL", n: ".DRAM > .DQSL_N" },
      model: { p: "ODT_off", n: "ODT_off" },
    },
  })
  expect(signals[1]).toMatchObject({
    receiverRef: { pin: ".DRAM > .DQL0", model: "ODT_off" },
  })
})
