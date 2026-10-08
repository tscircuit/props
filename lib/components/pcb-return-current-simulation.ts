import { expectTypesMatch } from "lib/typecheck"
import type { ReactNode } from "react"
import { z } from "zod"

/** Defines a pending PCB return-current experiment; rendering does not run it.
 * Frequency, mesh and sampling settings are supplied to the simulation CLI.
 */
export interface PcbReturnCurrentSimulationProps {
  /** Stable identity and readable name for the experiment. */
  name?: string
  /** One or more nested pcbreturncurrentexcitation elements. */
  children?: ReactNode
}

export const pcbReturnCurrentSimulationProps = z
  .object({
    name: z.string().trim().min(1).optional(),
    children: z.custom<ReactNode>().optional(),
  })
  .strict()

expectTypesMatch<
  PcbReturnCurrentSimulationProps,
  z.input<typeof pcbReturnCurrentSimulationProps>
>(true)
