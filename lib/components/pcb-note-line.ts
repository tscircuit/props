import { distance } from "circuit-json"
import { pcbLayoutProps, type PcbLayoutProps } from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface PcbNoteLineProps
  extends Omit<
    PcbLayoutProps,
    | "pcbLeftEdgeX"
    | "pcbRightEdgeX"
    | "pcbTopEdgeY"
    | "pcbBottomEdgeY"
    | "pcbX"
    | "pcbY"
    | "pcbOffsetX"
    | "pcbOffsetY"
    | "pcbRotation"
  > {
  x1: string | number
  y1: string | number
  x2: string | number
  y2: string | number
  strokeWidth?: string | number
  color?: string
  isDashed?: boolean
}

export const pcbNoteLineProps = pcbLayoutProps
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
    x1: distance,
    y1: distance,
    x2: distance,
    y2: distance,
    strokeWidth: distance.optional(),
    color: z.string().optional(),
    isDashed: z.boolean().optional(),
  })

expectTypesMatch<PcbNoteLineProps, z.input<typeof pcbNoteLineProps>>(true)

export type PcbNoteLinePropsInput = z.input<typeof pcbNoteLineProps>
