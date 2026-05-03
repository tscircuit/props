import { expect, test } from "bun:test"
import { autoroutingPhaseProps } from "../lib/components/autoroutingphase"

test("parses autorouting phase with explicit autorouter", () => {
  const result = autoroutingPhaseProps.parse({
    phaseIndex: 1,
    autorouter: "freerouting",
  })

  expect(result.phaseIndex).toBe(1)
  expect(result.autorouter).toBe("freerouting")
})
