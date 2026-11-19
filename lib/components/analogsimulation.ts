import { ms } from "circuit-json"
import type { AutocompleteString } from "lib/common/autocomplete"
import { expectTypesMatch } from "lib/typecheck"
import type { ReactNode } from "react"
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

/**
 * SPICE solver settings. itl1 (initial operating point), itl2 (DC sweep), and
 * itl4 (transient timestep) accept positive integer iteration counts only.
 * Omitted options use the engine default; values are forwarded unchanged.
 */
export interface SpiceOptions {
  method?: "trap" | "gear"
  reltol?: number | string
  abstol?: number | string
  vntol?: number | string
  itl1?: number
  itl2?: number
  itl4?: number
}

const spiceOptions = z.object({
  method: z.enum(["trap", "gear"]).optional(),
  reltol: z.union([z.number(), z.string()]).optional(),
  abstol: z.union([z.number(), z.string()]).optional(),
  vntol: z.union([z.number(), z.string()]).optional(),
  itl1: z.number().int().positive().optional(),
  itl2: z.number().int().positive().optional(),
  itl4: z.number().int().positive().optional(),
})

export interface AnalogAnalysisSimulationBaseProps {
  /** Stable identity for the simulation experiment. */
  name?: string
  /** SPICE implementation used to run this analysis. */
  spiceEngine?: AutocompleteString<"spicey" | "ngspice">
  /** Numerical solver settings forwarded to the selected SPICE engine. */
  spiceOptions?: SpiceOptions
  /** Render each probe with an independent vertical graph scale. */
  graphIndependentAxes?: boolean
  /** Optional nested sweep parameter for repeated analysis runs. */
  children?: ReactNode
}

export const analogAnalysisSimulationBaseProps = {
  name: z.string().optional(),
  spiceEngine: spiceEngine.optional(),
  spiceOptions: spiceOptions.optional(),
  graphIndependentAxes: z.boolean().optional(),
  children: z.custom<ReactNode>().optional(),
}

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
