import { expect, test } from "bun:test"
import { analogTransientSimulationProps } from "../lib"
import { channel } from "./fixtures/pcb-spice-channel"

test("PCB SPICE channel requires the PCB SPICE engine", () => {
  for (const spiceEngine of [undefined, "spicey", "ngspice"]) {
    const result = analogTransientSimulationProps.safeParse({
      spiceEngine,
      pcbSpiceChannel: channel,
    })
    expect(result.success).toBe(false)
    if (!result.success)
      expect(
        result.error.issues.some(
          (issue) => issue.path[0] === "pcbSpiceChannel",
        ),
      ).toBe(true)
  }
})
