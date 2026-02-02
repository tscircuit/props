import { distance } from "circuit-json"
import { pcbLayoutProps } from "lib/common/layout"
import { z } from "zod"

export const courtyardCircleProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    radius: distance,
    strokeWidth: distance.optional(),
    isFilled: z.boolean().optional(),
    hasStroke: z.boolean().optional(),
    isStrokeDashed: z.boolean().optional(),
    color: z.string().optional(),
  })
export type CourtyardCircleProps = z.input<typeof courtyardCircleProps>
