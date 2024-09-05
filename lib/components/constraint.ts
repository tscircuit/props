import type { Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
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
    pcb: z.literal(true),
    xdist: distance,
    left: z.string(),
    right: z.string(),
  }),
  z.object({
    pcb: z.literal(true),
    ydist: distance,
    top: z.string(),
    bottom: z.string(),
  }),
])
