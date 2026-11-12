import { expect, test } from "bun:test"
import { pcbChannelProps } from "lib"
import { simulation, data } from "./signal-integrity-fixtures"

test("PRBS patterns validate the full nonzero seed range", () => {
  for (const [pattern, max] of [
    [undefined, 127],
    ["prbs7", 127],
    ["prbs15", 32767],
    ["prbs31", 2147483647],
  ] as const) {
    for (const driverDisabled of [undefined, false, true]) {
      for (const seed of [1, max]) {
        const signal = (
          <simulation.pcbchannel
            {...data}
            pattern={pattern}
            seed={seed}
            driverDisabled={driverDisabled}
          />
        )
        expect(pcbChannelProps.parse(signal.props).seed).toBe(seed)
      }
      for (const seed of [0, -1, 0.5, 1.5, max + 1, NaN, Infinity, -Infinity]) {
        const signal = (
          <simulation.pcbchannel
            {...data}
            pattern={pattern}
            seed={seed}
            driverDisabled={driverDisabled}
          />
        )
        const parsed = pcbChannelProps.safeParse(signal.props)
        expect(parsed.success).toBe(false)
        if (!parsed.success)
          expect(parsed.error.issues).toEqual([
            expect.objectContaining({
              path: ["seed"],
              message: `Signal "DATA": ${pattern ?? "prbs7"} seed must be an integer in 1..${max}.`,
            }),
          ])
      }
    }
    const signal = <simulation.pcbchannel {...data} pattern={pattern} />
    expect(pcbChannelProps.parse(signal.props)).not.toHaveProperty("seed")
  }
})
