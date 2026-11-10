import { expect, test } from "bun:test"
import { expectTypesMatch } from "lib/typecheck"
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
  expectTypesMatch<z.input<typeof pcbChannelProps>, PcbChannelProps>(true)
  expectTypesMatch<
    z.input<typeof pcbTransientChannelSimulationProps>,
    PcbTransientChannelSimulationProps
  >(true)
  expectTypesMatch<
    z.output<typeof pcbTransientChannelSimulationProps>["duration"],
    number | undefined
  >(true)
  expectTypesMatch<
    z.output<typeof pcbTransientChannelSimulationProps>["bitRate"],
    number
  >(true)
  expectTypesMatch<z.output<typeof pcbChannelProps>["driverDisabled"], boolean>(
    true,
  )
  expectTypesMatch<
    z.output<typeof pcbTransientChannelSimulationProps>["allowUnroutedTraces"],
    boolean
  >(true)
  // @ts-expect-error Per-leg models require a differential pin pair.
  const single: SignalEndpoint = { pin: ".TX > .Y", model: { p: "P", n: "N" } }
  expect(
    pcbChannelProps.safeParse({ ...data, driverRef: single }).success,
  ).toBe(false)
})
