import { distance } from "circuit-json"
import { pcbLayoutProps } from "lib/common/layout"
import { z } from "zod"

export const fabricationNoteRectProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    width: distance,
    height: distance,
    strokeWidth: distance.optional(),
    isFilled: z.boolean().optional(),
    hasStroke: z.boolean().optional(),
    isStrokeDashed: z.boolean().optional(),
    color: z.string().optional(),
  })
export type FabricationNoteRectProps = z.input<typeof fabricationNoteRectProps>
