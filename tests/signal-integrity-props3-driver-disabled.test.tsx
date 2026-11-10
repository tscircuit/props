import { expect, test } from "bun:test"
import { pcbChannelProps } from "lib"
import { simulation, data } from "./signal-integrity-fixtures"

test("drivers default to enabled and can be disabled alongside a pattern", () => {
  for (const driverDisabled of [undefined, false, true]) {
    const signal = (
      <simulation.pcbchannel
        {...data}
        driverDisabled={driverDisabled}
        pattern="clock"
      />
    )
    expect(pcbChannelProps.parse(signal.props)).toMatchObject({
      driverDisabled: driverDisabled ?? false,
      pattern: "clock",
    })
  }
  const disabled = <simulation.pcbchannel {...data} driverDisabled />
  expect(pcbChannelProps.parse(disabled.props).driverDisabled).toBe(true)
})
