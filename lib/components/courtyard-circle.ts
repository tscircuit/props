import { distance } from "circuit-json"
import { pcbLayoutProps } from "lib/common/layout"
import { ninePointAnchor } from "lib/common/ninePointAnchor"
import { z } from "zod"
export const courtyardCircleProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    radius: distance,
    anchorAlignment: ninePointAnchor.optional(),
  })
export type CourtyardCircleProps = z.input<typeof courtyardCircleProps>
