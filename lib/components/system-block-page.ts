import { expectTypesMatch } from "lib/typecheck"
import type { ReactNode } from "react"
import { z } from "zod"

/** One high-level system overview, independent of schematic or PCB geometry. */
export interface SystemBlockPageProps {
  /** Stable page identity, unique within the circuit; trimmed and nonempty. */
  name: string
  /** Human-facing title; consumers fall back to name when omitted. */
  displayName?: string
  /** Plain-text explanation of the system's purpose. */
  description?: string
  /** Preferred automatic layout direction; defaults to right. */
  direction?: "right" | "left" | "down" | "up"
  /** System blocks, nested groups, and connections; preserved unchanged. */
  children?: ReactNode
}

export const systemBlockPageProps = z.object({
  name: z.string().trim().min(1),
  displayName: z.string().trim().min(1).optional(),
  description: z.string().optional(),
  direction: z.enum(["right", "left", "down", "up"]).default("right"),
  children: z.custom<ReactNode>().optional(),
})

export type SystemBlockPagePropsInput = z.input<typeof systemBlockPageProps>

expectTypesMatch<SystemBlockPageProps, SystemBlockPagePropsInput>(true)
