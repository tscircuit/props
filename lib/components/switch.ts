import { z } from "zod"
import { commonComponentProps } from "../types/common"

export const switchProps = commonComponentProps.extend({
  ftype: z.literal("switch"),
  switchType: z.enum(["spst"]).default("spst"),
  isNormallyClosed: z.boolean().default(false),
})
export type SwitchProps = z.input<typeof switchProps>
import { z } from "zod"
import { distance } from "@tscircuit/soup"

export const constraintProps = z.union([
  z.object({
    type: z.literal("xdist"),
    dist: distance,
    left: z.string(),
    right: z.string(),
  }),
  z.object({
    type: z.literal("ydist"),
    dist: distance,
    top: z.string(),
    bottom: z.string(),
  }),
])
export type ConstraintProps = z.input<typeof constraintProps>

export const constrainedLayoutProps = z.object({})
export type ConstrainedLayoutProps = z.input<typeof constrainedLayoutProps>
