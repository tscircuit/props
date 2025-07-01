import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"

export interface NetProps {
  name: string
  connectsTo?: string | string[]
}

export const netProps = z.object({
  name: z.string(),
  connectsTo: z.string().or(z.array(z.string())).optional(),
})

type InferredNetProps = z.input<typeof netProps>
expectTypesMatch<NetProps, InferredNetProps>(true)
