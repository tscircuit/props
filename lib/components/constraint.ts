import { expectTypesMatch } from "lib/typecheck"
import type { Distance } from "lib/common/distance"
import { distance } from "lib/common/distance"
import { z } from "zod"

export type PcbXDistConstraint = {
  pcb?: true
  xDist: Distance

  /**
   * Selector for left component, e.g. ".U1" or ".R1", you can also specify the
   * edge or center of the component e.g. ".R1 leftedge", ".R1 center"
   */
  left: string

  /**
   * Selector for right component, e.g. ".U1" or ".R1", you can also specify the
   * edge or center of the component e.g. ".R1 leftedge", ".R1 center"
   */
  right: string

  /**
   * If true, the provided distance is the distance between the closest edges of
   * the left and right components
   */
  edgeToEdge?: true

  /**
   * If true, the provided distance is the distance between the centers of the
   * left and right components
   */
  centerToCenter?: true

  /**
   * Optional X coordinate for the center point between left and right components.
   * Allows positioning both components on the x-axis.
   */
  centerX?: Distance
}

export type PcbYDistConstraint = {
  pcb?: true
  yDist: Distance

  /**
   * Selector for top component, e.g. ".U1" or ".R1", you can also specify the
   * edge or center of the component e.g. ".R1 topedge", ".R1 center"
   */
  top: string

  /**
   * Selector for bottom component, e.g. ".U1" or ".R1", you can also specify the
   * edge or center of the component e.g. ".R1 bottomedge", ".R1 center"
   */
  bottom: string

  edgeToEdge?: true
  centerToCenter?: true

  /**
   * Optional Y coordinate for the center point between top and bottom components.
   * Allows positioning both components on the y-axis.
   */
  centerY?: Distance
}

export type PcbSameYConstraint = {
  pcb?: true
  sameY?: true

  /**
   * Selector for components, e.g. [".U1", ".R1"], you can also specify the
   * edge or center of the component e.g. [".R1 leftedge", ".U1 center"]
   */
  for: string[]
}

export type PcbSameXConstraint = {
  pcb?: true
  sameX?: true
  /**
   * Selector for components, e.g. [".U1", ".R1"], you can also specify the
   * edge or center of the component e.g. [".R1 leftedge", ".U1 center"]
   */
  for: string[]
}

export type ConstraintProps =
  | PcbXDistConstraint
  | PcbYDistConstraint
  | PcbSameYConstraint
  | PcbSameXConstraint

// -----------------------------------------------------------------------------
// Zod
// -----------------------------------------------------------------------------

export const pcbXDistConstraintProps = z.object({
  pcb: z.literal(true).optional(),
  xDist: distance,
  left: z.string(),
  right: z.string(),

  edgeToEdge: z.literal(true).optional(),
  centerToCenter: z.literal(true).optional(),
  centerX: distance.optional(),
})
expectTypesMatch<PcbXDistConstraint, z.input<typeof pcbXDistConstraintProps>>(
  true,
)

export const pcbYDistConstraintProps = z.object({
  pcb: z.literal(true).optional(),
  yDist: distance,
  top: z.string(),
  bottom: z.string(),

  edgeToEdge: z.literal(true).optional(),
  centerToCenter: z.literal(true).optional(),
  centerY: distance.optional(),
})
expectTypesMatch<PcbYDistConstraint, z.input<typeof pcbYDistConstraintProps>>(
  true,
)

export const pcbSameYConstraintProps = z.object({
  pcb: z.literal(true).optional(),
  sameY: z.literal(true).optional(),
  for: z.array(z.string()),
})
expectTypesMatch<PcbSameYConstraint, z.input<typeof pcbSameYConstraintProps>>(
  true,
)

export const pcbSameXConstraintProps = z.object({
  pcb: z.literal(true).optional(),
  sameX: z.literal(true).optional(),
  for: z.array(z.string()),
})
expectTypesMatch<PcbSameXConstraint, z.input<typeof pcbSameXConstraintProps>>(
  true,
)

export const constraintProps = z.union([
  pcbXDistConstraintProps,
  pcbYDistConstraintProps,
  pcbSameYConstraintProps,
  pcbSameXConstraintProps,
])

expectTypesMatch<ConstraintProps, z.input<typeof constraintProps>>(true)
