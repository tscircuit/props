import { ms } from "circuit-json"
import type { AutocompleteString } from "lib/common/autocomplete"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface AnalogSimulationProps {
  name?: string
  simulationType?: "spice_transient_analysis"
  duration?: number | string
  startTime?: number | string
  timePerStep?: number | string
  spiceEngine?: AutocompleteString<"spicey" | "ngspice">
  spiceOptions?: SpiceOptions
  graphIndependentAxes?: boolean
}

const spiceEngine = z.custom<AutocompleteString<"spicey" | "ngspice">>(
  (value) => typeof value === "string",
)

export interface SpiceOptions {
  method?: "trap" | "gear"
  reltol?: number | string
  abstol?: number | string
  vntol?: number | string
}

const spiceOptions = z.object({
  method: z.enum(["trap", "gear"]).optional(),
  reltol: z.union([z.number(), z.string()]).optional(),
  abstol: z.union([z.number(), z.string()]).optional(),
  vntol: z.union([z.number(), z.string()]).optional(),
})

export const analogSimulationProps = z.object({
  name: z.string().optional(),
  simulationType: z
    .literal("spice_transient_analysis")
    .default("spice_transient_analysis"),
  duration: ms.optional(),
  startTime: ms.optional(),
  timePerStep: ms.optional(),
  spiceEngine: spiceEngine.optional(),
  spiceOptions: spiceOptions.optional(),
  graphIndependentAxes: z.boolean().optional(),
})

expectTypesMatch<AnalogSimulationProps, z.input<typeof analogSimulationProps>>(
  true,
)
