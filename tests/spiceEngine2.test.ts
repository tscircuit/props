import { expect, test } from "bun:test"
import { expectTypeOf } from "expect-type"
import {
  type AnalogAnalysisSimulationBaseProps,
  type AnalogSimulationProps,
  analogAnalysisSimulationBaseProps,
  analogSimulationProps,
} from "lib/components/analogsimulation"
import { type PlatformConfig, platformConfig } from "lib/platformConfig"
import type { z } from "zod"

test("built-in engine suggestions omit the removed PCB SPICE SI flow", () => {
  type SuggestedPcbSpice<T> = Extract<T, "pcb_spice">
  expectTypeOf<
    SuggestedPcbSpice<AnalogSimulationProps["spiceEngine"]>
  >().toEqualTypeOf<never>()
  expectTypeOf<
    SuggestedPcbSpice<AnalogAnalysisSimulationBaseProps["spiceEngine"]>
  >().toEqualTypeOf<never>()
  expectTypeOf<
    SuggestedPcbSpice<z.input<typeof analogSimulationProps>["spiceEngine"]>
  >().toEqualTypeOf<never>()
  expectTypeOf<
    SuggestedPcbSpice<
      z.input<typeof analogAnalysisSimulationBaseProps.spiceEngine>
    >
  >().toEqualTypeOf<never>()
  expectTypeOf<
    SuggestedPcbSpice<PlatformConfig["defaultSpiceEngine"]>
  >().toEqualTypeOf<never>()
  expectTypeOf<
    SuggestedPcbSpice<z.input<typeof platformConfig>["defaultSpiceEngine"]>
  >().toEqualTypeOf<never>()

  expect(
    analogSimulationProps.parse({ spiceEngine: "custom_engine" }).spiceEngine,
  ).toBe("custom_engine")
})
