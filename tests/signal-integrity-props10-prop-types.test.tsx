import { expect, test } from "bun:test"
import { expectTypeOf } from "expect-type"
import type { z } from "zod"
import {
  pcbTransientChannelSimulationProps,
  pcbChannelProps,
  type PcbTransientChannelSimulationProps,
  type PcbChannelProps,
  type SignalEndpoint,
} from "lib"
import { data } from "./signal-integrity-fixtures"

test("authoring inputs and normalized outputs preserve their types", () => {
  expectTypeOf<
    z.input<typeof pcbChannelProps>
  >().toEqualTypeOf<PcbChannelProps>()
  expectTypeOf<
    z.input<typeof pcbTransientChannelSimulationProps>
  >().toEqualTypeOf<PcbTransientChannelSimulationProps>()
  expectTypeOf<
    z.output<typeof pcbTransientChannelSimulationProps>["duration"]
  >().toEqualTypeOf<number | undefined>()
  expectTypeOf<
    z.output<typeof pcbTransientChannelSimulationProps>["bitRate"]
  >().toEqualTypeOf<number>()
  // @ts-expect-error Per-leg models require a differential pin pair.
  const single: SignalEndpoint = { pin: ".TX > .Y", model: { p: "P", n: "N" } }
  expect(
    pcbChannelProps.safeParse({ ...data, driverRef: single }).success,
  ).toBe(false)
})
