import { expect, test } from "bun:test"
import { boardProps } from "../lib/components/board"
import { autoroutingPhaseProps } from "../lib/components/autoroutingphase"
import {
  routingTolerances,
  subcircuitGroupProps,
} from "../lib/components/group"

test("trace-to-hole clearance parses units, preserves omission and zero, and rejects invalid distances", () => {
  for (const schema of [
    boardProps,
    subcircuitGroupProps,
    autoroutingPhaseProps,
    routingTolerances,
  ]) {
    expect(
      schema.parse({ minTraceToHoleClearance: 0.2 }).minTraceToHoleClearance,
    ).toBe(0.2)
    expect(
      schema.parse({ minTraceToHoleClearance: "0.2mm" })
        .minTraceToHoleClearance,
    ).toBe(0.2)
    expect(
      schema.parse({ minTraceToHoleClearance: "0.01in" })
        .minTraceToHoleClearance,
    ).toBeCloseTo(0.254)
    expect(
      schema.parse({ minTraceToHoleClearance: 0 }).minTraceToHoleClearance,
    ).toBe(0)
    expect(schema.parse({}).minTraceToHoleClearance).toBeUndefined()
    for (const value of [-0.2, "-0.2mm", NaN, Infinity, "invalid"]) {
      expect(schema.safeParse({ minTraceToHoleClearance: value }).success).toBe(
        false,
      )
    }
  }
})
