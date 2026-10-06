import { length, route_hint_point } from "circuit-json"
import { pcbLayoutProps } from "lib/common/layout"
import { z } from "zod"

export const fabricationNotePathProps = pcbLayoutProps
  .omit({
    pcbLeftEdgeX: true,
    pcbRightEdgeX: true,
    pcbTopEdgeY: true,
    pcbBottomEdgeY: true,
    pcbX: true,
    pcbY: true,
    pcbOffsetX: true,
    pcbOffsetY: true,
    pcbRotation: true,
  })
  .extend({
    route: z.array(route_hint_point),
    strokeWidth: length.optional(),
    color: z.string().optional(),
    /** Fill the route, closing its boundary implicitly. Omitted means false. */
    isFilled: z.boolean().optional(),
    /** Draw the route's outline. Omitted means true; false disables it. */
    hasStroke: z.boolean().optional(),
  })
export type FabricationNotePathProps = z.input<typeof fabricationNotePathProps>
