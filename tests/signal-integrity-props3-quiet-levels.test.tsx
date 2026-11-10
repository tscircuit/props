import { expect, test } from "bun:test"
import { pcbChannelProps } from "lib"
import { simulation } from "./signal-integrity-fixtures"

test("quiet levels declare crosstalk victims", () => {
  for (const quiet of ["low", "high", "off"] as const) {
    const victim = (
      <simulation.pcbchannel
        name="D1"
        driverRef=".TX > .D1"
        receiverRef=".RX > .D1"
        quiet={quiet}
      />
    )
    expect(pcbChannelProps.parse(victim.props).quiet).toBe(quiet)
  }
})
