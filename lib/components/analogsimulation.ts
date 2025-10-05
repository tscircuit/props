import { ms } from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface AnalogSimulationProps {
  simulationType?: "spice_transient_analysis"
  duration?: number | string
  timePerStep?: number | string
}

export const analogSimulationProps = z.object({
  simulationType: z
    .literal("spice_transient_analysis")
    .default("spice_transient_analysis"),
  duration: ms.optional(),
  timePerStep: ms.optional(),
})

expectTypesMatch<AnalogSimulationProps, z.input<typeof analogSimulationProps>>(
  true,
)
