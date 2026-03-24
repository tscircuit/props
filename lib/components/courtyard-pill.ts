import { distance } from "circuit-json"
import { pcbLayoutProps } from "lib/common/layout"
import { ninePointAnchor } from "lib/common/ninePointAnchor"
import { z } from "zod"
export const courtyardPillProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    width: distance,
    height: distance,
    radius: distance,
    anchorAlignment: ninePointAnchor.optional(),
  })
export type CourtyardPillProps = z.input<typeof courtyardPillProps>
