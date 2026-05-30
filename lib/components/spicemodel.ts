import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface SpicemodelProps {
  source: string
  spicePinMapping?: Record<string, string>
}

export const spicemodelProps = z.object({
  source: z.string(),
  spicePinMapping: z.record(z.string(), z.string()).optional(),
})

type InferredSpicemodelProps = z.input<typeof spicemodelProps>
expectTypesMatch<SpicemodelProps, InferredSpicemodelProps>(true)
