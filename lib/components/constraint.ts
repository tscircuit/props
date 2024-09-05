import { expectTypesMatch } from "lib/typecheck"
import type { Distance } from "lib/common/distance"
import { distance } from "lib/common/distance"
import { z } from "zod"

export type PcbXDistConstraint = {
  pcb?: true
  type?: "xdist"
  xdist: Distance
  left: string
  right: string

  edgeToEdge?: true
  centerToCenter?: true

  fromLeftEdge?: true
  fromLeftCenter?: true
  toRightEdge?: true
  toRightCenter?: true
}

export type PcbYDistConstraint = {
  pcb?: true
  type?: "ydist"
  ydist: Distance
  top: string
  bottom: string

  edgeToEdge?: true
  centerToCenter?: true

  fromTopEdge?: true
  fromTopCenter?: true
  toBottomEdge?: true
  toBottomCenter?: true
}

export type ConstraintProps = PcbXDistConstraint | PcbYDistConstraint

export const constraintProps = z.union([
  z.object({
    pcb: z.literal(true).optional(),
    type: z.literal("xdist").optional(),
    xdist: distance,
    left: z.string(),
    right: z.string(),

    edgeToEdge: z.literal(true).optional(),
    centerToCenter: z.literal(true).optional(),

    fromLeftEdge: z.literal(true).optional(),
    fromLeftCenter: z.literal(true).optional(),
    toRightEdge: z.literal(true).optional(),
    toRightCenter: z.literal(true).optional(),
  }),
  z.object({
    pcb: z.literal(true).optional(),
    type: z.literal("ydist").optional(),
    ydist: distance,
    top: z.string(),
    bottom: z.string(),

    edgeToEdge: z.literal(true).optional(),
    centerToCenter: z.literal(true).optional(),

    fromTopEdge: z.literal(true).optional(),
    fromTopCenter: z.literal(true).optional(),
    toBottomEdge: z.literal(true).optional(),
    toBottomCenter: z.literal(true).optional(),
  }),
])

expectTypesMatch<ConstraintProps, z.input<typeof constraintProps>>(true)
