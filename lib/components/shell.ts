import { expectTypesMatch } from "../typecheck"
import { z } from "zod"

/** Props for a logical multi-unit physical package shell. */
export interface ShellProps {
  name: string
  mpn?: string
  manufacturer?: string
  pinCount?: number
  children?: any
}

/** Runtime parser for {@link ShellProps}. */
export const shellProps = z.object({
  name: z.string().min(1),
  mpn: z.string().optional(),
  manufacturer: z.string().optional(),
  pinCount: z.number().int().positive().optional(),
  children: z.any().optional(),
})

type InferredShellProps = z.input<typeof shellProps>
expectTypesMatch<ShellProps, InferredShellProps>(true)
