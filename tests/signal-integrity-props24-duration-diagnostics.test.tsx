import { expect, test } from "bun:test"
import { pcbTransientChannelSimulationProps } from "lib"
import { simulation } from "./signal-integrity-fixtures"

test("invalid durations report the RFC diagnostic", () => {
  for (const [bitRate, duration] of [
    ...[
      0,
      -1,
      Infinity,
      NaN,
      "-1ns",
      "0UI",
      "1e400s",
      "1V",
      "garbage",
      "-1UI",
    ].map((duration) => [20e6, duration] as const),
    [1e-320, "1UI"],
    [1e308, "1e-20UI"],
  ] as const) {
    const block = (
      <simulation.pcbtransientchannelsimulation
        bitRate={bitRate}
        duration={duration}
      />
    )
    const parsed = pcbTransientChannelSimulationProps.safeParse(block.props)
    expect(parsed.success).toBe(false)
    if (!parsed.success)
      expect(parsed.error.issues[0]).toMatchObject({
        path: ["duration"],
        message: "duration must be finite and greater than zero.",
      })
  }
})
