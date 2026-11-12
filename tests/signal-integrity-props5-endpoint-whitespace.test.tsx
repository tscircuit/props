import { expect, test } from "bun:test"
import { pcbChannelProps } from "lib"
import { simulation, data } from "./signal-integrity-fixtures"

test("endpoints trim whitespace and reject blank text", () => {
  for (const [_, endpoint] of [
    ["single pin", (value: string) => value],
    ["pair p", (value: string) => ({ p: value, n: ".U > .N" })],
    ["pair n", (value: string) => ({ p: ".U > .P", n: value })],
    ["wrapped pin", (value: string) => ({ pin: value })],
    [
      "wrapped pair p",
      (value: string) => ({ pin: { p: value, n: ".U > .N" } }),
    ],
    [
      "wrapped pair n",
      (value: string) => ({ pin: { p: ".U > .P", n: value } }),
    ],
    ["single model", (value: string) => ({ pin: ".U > .Y", model: value })],
    [
      "pair model",
      (value: string) => ({
        pin: { p: ".U > .P", n: ".U > .N" },
        model: value,
      }),
    ],
    [
      "model p",
      (value: string) => ({
        pin: { p: ".U > .P", n: ".U > .N" },
        model: { p: value, n: "N" },
      }),
    ],
    [
      "model n",
      (value: string) => ({
        pin: { p: ".U > .P", n: ".U > .N" },
        model: { p: "P", n: value },
      }),
    ],
  ] as const) {
    for (const value of ["", " \t\n ", " \tVALUE\n "]) {
      const ref = endpoint(value)
      const trimmed = endpoint(value.trim())
      for (const [field, input, expected] of [
        ["driverRef", ref, trimmed],
        ["receiverRef", ref, trimmed],
        ["receiverRef", [ref], [trimmed]],
      ] as const) {
        const signal = (
          <simulation.pcbchannel {...data} {...{ [field]: input }} />
        )
        const parsed = pcbChannelProps.safeParse(signal.props)
        expect(parsed.success).toBe(value.trim().length > 0)
        if (parsed.success)
          expect(parsed.data).toMatchObject({ [field]: expected })
      }
    }
  }
})
