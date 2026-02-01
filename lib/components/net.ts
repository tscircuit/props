import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"

export interface NetProps {
  name: string
  connectsTo?: string | string[]
  highlightColor?: string
  isPowerNet?: boolean
  isGroundNet?: boolean
  isDrawnWithInversionCircle?: boolean
}

export const netProps = z.object({
  name: z.string(),
  connectsTo: z.string().or(z.array(z.string())).optional(),
  highlightColor: z.string().optional(),
  isPowerNet: z.boolean().optional(),
  isGroundNet: z.boolean().optional(),
  isDrawnWithInversionCircle: z.boolean().optional(),
})

type InferredNetProps = z.input<typeof netProps>
expectTypesMatch<NetProps, InferredNetProps>(true)
