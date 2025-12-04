import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface ToolingrailProps {
  children?: any
}

export const toolingrailProps = z.object({
  children: z.any().optional(),
})

type InferredToolingrailProps = z.input<typeof toolingrailProps>
expectTypesMatch<ToolingrailProps, InferredToolingrailProps>(true)
