import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface SpiceModelProps {
  source: string
  spicePinMapping?: Record<string, string>
}

export const spicemodelProps = z.object({
  source: z.string(),
  spicePinMapping: z.record(z.string(), z.string()).optional(),
})

type InferredSpiceModelProps = z.input<typeof spicemodelProps>
expectTypesMatch<SpiceModelProps, InferredSpiceModelProps>(true)
