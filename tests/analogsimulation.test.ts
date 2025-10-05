import { expect, test } from "bun:test"
import {
  analogSimulationProps,
  type AnalogSimulationProps,
} from "lib/components/analogsimulation"
import { expectTypeOf } from "expect-type"
import { z } from "zod"

test("analog simulation defaults to spice transient analysis", () => {
  const raw: AnalogSimulationProps = {}

  expectTypeOf(raw).toMatchTypeOf<z.input<typeof analogSimulationProps>>()

  const parsed = analogSimulationProps.parse(raw)
  expect(parsed.simulationType).toBe("spice_transient_analysis")
})
