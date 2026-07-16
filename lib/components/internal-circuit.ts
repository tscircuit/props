import { expectTypesMatch } from "lib/typecheck"
import type { ReactNode } from "react"
import { z } from "zod"

/**
 * Props for a semantic container that groups the functional components inside
 * a physical chip package.
 */
export interface InternalCircuitProps {
  children?: ReactNode
}

export const internalCircuitProps = z.object({
  children: z.custom<ReactNode>().optional(),
})

expectTypesMatch<InternalCircuitProps, z.input<typeof internalCircuitProps>>(
  true,
)
