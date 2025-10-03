import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface AnalogSimulationProps {
  simulationType?: "spice_transient_analysis"
}

export const analogSimulationProps = z.object({
  simulationType: z
    .literal("spice_transient_analysis")
    .default("spice_transient_analysis"),
})

expectTypesMatch<AnalogSimulationProps, z.input<typeof analogSimulationProps>>(
  true,
)
