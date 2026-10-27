import { expect, test } from "bun:test"
import { expectTypeOf } from "expect-type"
import {
  analogAnalysisSimulationBaseProps,
  analogSimulationProps,
  type AnalogAnalysisSimulationBaseProps,
  type AnalogSimulationProps,
} from "lib/components/analogsimulation"
import { platformConfig, type PlatformConfig } from "lib/platformConfig"
import type { z } from "zod"

test("spiceEngineMap simulate returns simulation result", async () => {
  const config = platformConfig.parse({
    spiceEngineMap: {
      default: {
        async simulate(spiceString: string) {
          expect(spiceString).toBe("R1 1 0 1k")

          return {
            engineVersionString: "1.0.0",
            simulationResultCircuitJson: [],
          }
        },
      },
    },
  })

  const spiceEngine = config.spiceEngineMap?.default
  if (!spiceEngine) throw new Error("expected default spice engine")

  const result = await spiceEngine.simulate("R1 1 0 1k")
  expect(result?.engineVersionString).toBe("1.0.0")
  expect(Array.isArray(result?.simulationResultCircuitJson)).toBe(true)
})

test("pcb_spice is a suggested engine in prop and schema types", () => {
  type SuggestedPcbSpice<T> = Extract<T, "pcb_spice">
  expectTypeOf<
    SuggestedPcbSpice<AnalogSimulationProps["spiceEngine"]>
  >().toEqualTypeOf<"pcb_spice">()
  expectTypeOf<
    SuggestedPcbSpice<AnalogAnalysisSimulationBaseProps["spiceEngine"]>
  >().toEqualTypeOf<"pcb_spice">()
  expectTypeOf<
    SuggestedPcbSpice<z.input<typeof analogSimulationProps>["spiceEngine"]>
  >().toEqualTypeOf<"pcb_spice">()
  expectTypeOf<
    SuggestedPcbSpice<
      z.input<typeof analogAnalysisSimulationBaseProps.spiceEngine>
    >
  >().toEqualTypeOf<"pcb_spice">()
  expectTypeOf<
    SuggestedPcbSpice<PlatformConfig["defaultSpiceEngine"]>
  >().toEqualTypeOf<"pcb_spice">()
  expectTypeOf<
    SuggestedPcbSpice<z.input<typeof platformConfig>["defaultSpiceEngine"]>
  >().toEqualTypeOf<"pcb_spice">()

  expect(
    analogSimulationProps.parse({ spiceEngine: "pcb_spice" }).spiceEngine,
  ).toBe("pcb_spice")
})
