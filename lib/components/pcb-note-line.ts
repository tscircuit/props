import { distance } from "circuit-json"
import { pcbLayoutProps } from "lib/common/layout"
import { z } from "zod"

export const pcbNoteLineProps = pcbLayoutProps
  .omit({ pcbX: true, pcbY: true, pcbRotation: true })
  .extend({
    x1: distance,
    y1: distance,
    x2: distance,
    y2: distance,
    strokeWidth: distance.optional(),
    color: z.string().optional(),
    isDashed: z.boolean().optional(),
  })
export type PcbNoteLineProps = z.input<typeof pcbNoteLineProps>
