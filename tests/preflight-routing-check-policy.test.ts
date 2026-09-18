import { expect, test } from "bun:test"
import { expectTypeOf } from "expect-type"
import {
  type AutoroutingPhaseProps,
  type BoardProps,
  type PreflightRoutingCheckPolicy,
  type SubcircuitProps,
  autoroutingPhaseProps,
  boardProps,
  subcircuitProps,
} from "lib"
import type { z } from "zod"

for (const [name, schema] of [
  ["autoroutingphase", autoroutingPhaseProps],
  ["board", boardProps],
  ["subcircuit", subcircuitProps],
] as const) {
  test(`${name} preserves all three preflight routing check policies`, () => {
    for (const policy of ["none", "basic", "conservative"] as const) {
      expect(
        schema.parse({ preflightRoutingCheckPolicy: policy })
          .preflightRoutingCheckPolicy,
      ).toBe(policy)
    }
  })

  test(`${name} leaves the preflight routing check policy unset`, () => {
    const omitted = schema.parse({})
    expect(omitted.preflightRoutingCheckPolicy).toBeUndefined()
    expect("preflightRoutingCheckPolicy" in omitted).toBe(false)
    expect(
      schema.parse({ preflightRoutingCheckPolicy: undefined })
        .preflightRoutingCheckPolicy,
    ).toBeUndefined()
  })

  test(`${name} rejects unsupported preflight routing check policies`, () => {
    for (const policy of [
      "aggressive",
      "CONSERVATIVE",
      "",
      true,
      false,
      0,
      null,
      [],
      {},
    ]) {
      expect(
        schema.safeParse({ preflightRoutingCheckPolicy: policy }).success,
      ).toBe(false)
    }
  })
}

test("preflight routing check policy types are optional and narrow", () => {
  type Policy = "none" | "basic" | "conservative" | undefined
  expectTypeOf<PreflightRoutingCheckPolicy>().toEqualTypeOf<
    "none" | "basic" | "conservative"
  >()
  expectTypeOf<
    AutoroutingPhaseProps["preflightRoutingCheckPolicy"]
  >().toEqualTypeOf<Policy>()
  expectTypeOf<
    BoardProps["preflightRoutingCheckPolicy"]
  >().toEqualTypeOf<Policy>()
  expectTypeOf<
    SubcircuitProps["preflightRoutingCheckPolicy"]
  >().toEqualTypeOf<Policy>()
  expectTypeOf<
    z.input<typeof autoroutingPhaseProps>["preflightRoutingCheckPolicy"]
  >().toEqualTypeOf<Policy>()
  expectTypeOf<
    z.output<typeof autoroutingPhaseProps>["preflightRoutingCheckPolicy"]
  >().toEqualTypeOf<Policy>()
  expectTypeOf<
    z.output<typeof boardProps>["preflightRoutingCheckPolicy"]
  >().toEqualTypeOf<Policy>()
  expectTypeOf<
    z.output<typeof subcircuitProps>["preflightRoutingCheckPolicy"]
  >().toEqualTypeOf<Policy>()
})
