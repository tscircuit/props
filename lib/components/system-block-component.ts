import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import {
  type SystemBlockPcbReferenceProps,
  refineSystemBlockPcbReference,
  systemBlockPcbReferenceShape,
} from "../systemblock/pcb-reference"

/** A functional block, optionally associated with one or more PCB components. */
export interface SystemBlockComponentProps
  extends SystemBlockPcbReferenceProps {
  /** Stable block identity, unique across its page; trimmed and nonempty. */
  name: string
  /** Human-facing title; consumers fall back to name when omitted. */
  displayName?: string
  /** Plain-text explanation of what the block does. */
  description?: string
}

export const systemBlockComponentProps = z
  .object({
    ...systemBlockPcbReferenceShape,
    name: z.string().trim().min(1),
    displayName: z.string().trim().min(1).optional(),
    description: z.string().optional(),
  })
  .superRefine(refineSystemBlockPcbReference)

export type SystemBlockComponentPropsInput = z.input<
  typeof systemBlockComponentProps
>

expectTypesMatch<SystemBlockComponentProps, SystemBlockComponentPropsInput>(
  true,
)
