import { ms } from "circuit-json"
import type { AutocompleteString } from "lib/common/autocomplete"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface AnalogSimulationProps {
  simulationType?: "spice_transient_analysis"
  duration?: number | string
  timePerStep?: number | string
  spiceEngine?: AutocompleteString<"spicey" | "ngspice">
}

const spiceEngine = z.custom<AutocompleteString<"spicey" | "ngspice">>(
  (value) => typeof value === "string",
)

export const analogSimulationProps = z.object({
  simulationType: z
    .literal("spice_transient_analysis")
    .default("spice_transient_analysis"),
  duration: ms.optional(),
  timePerStep: ms.optional(),
  spiceEngine: spiceEngine.optional(),
})

expectTypesMatch<AnalogSimulationProps, z.input<typeof analogSimulationProps>>(
  true,
)
