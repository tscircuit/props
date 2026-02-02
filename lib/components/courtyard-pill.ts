import { distance } from "circuit-json"
import { pcbLayoutProps } from "lib/common/layout"
import { z } from "zod"

export const courtyardPillProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    width: distance,
    height: distance,
    radius: distance,
    strokeWidth: distance.optional(),
    isFilled: z.boolean().optional(),
    hasStroke: z.boolean().optional(),
    isStrokeDashed: z.boolean().optional(),
    color: z.string().optional(),
  })
export type CourtyardPillProps = z.input<typeof courtyardPillProps>
