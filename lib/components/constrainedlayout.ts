import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface ConstrainedLayoutProps {
  name?: string
  pcbOnly?: boolean
  schOnly?: boolean
}

export const constrainedLayoutProps = z.object({
  name: z.string().optional(),
  pcbOnly: z.boolean().optional(),
  schOnly: z.boolean().optional(),
})

export type InferredConstrainedLayoutProps = z.input<
  typeof constrainedLayoutProps
>

expectTypesMatch<InferredConstrainedLayoutProps, ConstrainedLayoutProps>(true)
