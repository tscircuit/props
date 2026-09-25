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
      schema.parse({ minTraceToHoleEdgeClearance: 0.2 })
        .minTraceToHoleEdgeClearance,
    ).toBe(0.2)
    expect(
      schema.parse({ minTraceToHoleEdgeClearance: "0.2mm" })
        .minTraceToHoleEdgeClearance,
    ).toBe(0.2)
    expect(
      schema.parse({ minTraceToHoleEdgeClearance: "0.01in" })
        .minTraceToHoleEdgeClearance,
    ).toBeCloseTo(0.254)
    expect(
      schema.parse({ minTraceToHoleEdgeClearance: 0 })
        .minTraceToHoleEdgeClearance,
    ).toBe(0)
    expect(schema.parse({}).minTraceToHoleEdgeClearance).toBeUndefined()
    for (const value of [-0.2, "-0.2mm", NaN, Infinity, "invalid"]) {
      expect(
        schema.safeParse({ minTraceToHoleEdgeClearance: value }).success,
      ).toBe(false)
    }
  }
})
