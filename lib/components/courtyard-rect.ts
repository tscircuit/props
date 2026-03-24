import { distance } from "circuit-json"
import { pcbLayoutProps } from "lib/common/layout"
import { ninePointAnchor } from "lib/common/ninePointAnchor"
import { z } from "zod"

export const courtyardRectProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    width: distance,
    height: distance,
    strokeWidth: distance.optional(),
    isFilled: z.boolean().optional(),
    hasStroke: z.boolean().optional(),
    isStrokeDashed: z.boolean().optional(),
    color: z.string().optional(),
    anchorAlignment: ninePointAnchor.optional(),
  })
export type CourtyardRectProps = z.input<typeof courtyardRectProps>
