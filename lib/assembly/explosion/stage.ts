import { expectTypesMatch } from "lib/typecheck"
import type { ReactNode } from "react"
import { z } from "zod"

/** A named explosion stage owned by its containing device or subassembly. */
export interface AssemblyExplosionStageProps {
  /** Stable stage identity, unique within the owning assembly. */
  name: string
  /** Stage that must execute after this one; qualified names may cross assembly scopes. */
  nextStageRef?: string
  /** Stage that must execute before this one; qualified names may cross assembly scopes. */
  prevStageRef?: string
  /** Ordered explosion moves; preserved unchanged for the consumer. */
  children?: ReactNode
}

export const assemblyExplosionStageProps = z.object({
  name: z.string().trim().min(1),
  nextStageRef: z.string().trim().min(1).optional(),
  prevStageRef: z.string().trim().min(1).optional(),
  children: z.custom<ReactNode>().optional(),
})

export type AssemblyExplosionStagePropsInput = z.input<
  typeof assemblyExplosionStageProps
>

expectTypesMatch<AssemblyExplosionStageProps, AssemblyExplosionStagePropsInput>(
  true,
)
