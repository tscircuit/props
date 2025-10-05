import { time } from "../common/time"
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
  duration: time.optional(),
  timePerStep: time.optional(),
})

expectTypesMatch<AnalogSimulationProps, z.input<typeof analogSimulationProps>>(
  true,
)
