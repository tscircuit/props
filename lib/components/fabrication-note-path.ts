import { length, route_hint_point } from "circuit-json"
import { pcbLayoutProps } from "lib/common/layout"
import { z } from "zod"

export const fabricationNotePathProps = pcbLayoutProps
  .omit({ pcbX: true, pcbY: true, pcbRotation: true })
  .extend({
    route: z.array(route_hint_point),
    strokeWidth: length.optional(),
    color: z.string().optional(),
  })
export type FabricationNotePathProps = z.input<typeof fabricationNotePathProps>
