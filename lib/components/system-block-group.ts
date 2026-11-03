import { expectTypesMatch } from "lib/typecheck"
import type { ReactNode } from "react"
import { z } from "zod"
import {
  type SystemBlockPcbReferenceProps,
  refineSystemBlockPcbReference,
  systemBlockPcbReferenceShape,
} from "../systemblock/pcb-reference"

/** A subsystem boundary containing blocks, nested groups, and connections. */
export interface SystemBlockGroupProps extends SystemBlockPcbReferenceProps {
  /** Stable group identity, unique across its page; trimmed and nonempty. */
  name: string
  /** Human-facing title; consumers fall back to name when omitted. */
  displayName?: string
  /** Plain-text explanation of the subsystem's responsibility. */
  description?: string
  /** Preserved unchanged; grouping does not create electrical connectivity. */
  children?: ReactNode
}

export const systemBlockGroupProps = z
  .object({
    ...systemBlockPcbReferenceShape,
    name: z.string().trim().min(1),
    displayName: z.string().trim().min(1).optional(),
    description: z.string().optional(),
    children: z.custom<ReactNode>().optional(),
  })
  .superRefine(refineSystemBlockPcbReference)

export type SystemBlockGroupPropsInput = z.input<typeof systemBlockGroupProps>

expectTypesMatch<SystemBlockGroupProps, SystemBlockGroupPropsInput>(true)
