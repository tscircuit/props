import { expectTypesMatch } from "lib/typecheck"
import type { Distance } from "lib/common/distance"
import { distance } from "lib/common/distance"
import { z } from "zod"

export type PcbXDistConstraint = {
  pcb?: true
  xdist: Distance
  left: string
  right: string
}

export type PcbYDistConstraint = {
  pcb?: true
  ydist: Distance
  top: string
  bottom: string
}

export type ConstraintProps = PcbXDistConstraint | PcbYDistConstraint

export const constraintProps = z.union([
  z.object({
    pcb: z.literal(true).optional(),
    xdist: distance,
    left: z.string(),
    right: z.string(),
  }),
  z.object({
    pcb: z.literal(true).optional(),
    ydist: distance,
    top: z.string(),
    bottom: z.string(),
  }),
])

expectTypesMatch<ConstraintProps, z.input<typeof constraintProps>>(true)
