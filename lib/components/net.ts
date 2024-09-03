import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"

export interface NetProps {
  name: string
}

export const netProps = z.object({
  name: z.string(),
})

type InferredNetProps = z.input<typeof netProps>
expectTypesMatch<NetProps, InferredNetProps>(true)
