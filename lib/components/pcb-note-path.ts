import {
  length,
  route_hint_point,
  type RouteHintPointInput,
} from "circuit-json"
import { pcbLayoutProps, type PcbLayoutProps } from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface PcbNotePathProps
  extends Omit<
    PcbLayoutProps,
    | "pcbX"
    | "pcbY"
    | "pcbLeftX"
    | "pcbRightX"
    | "pcbTopY"
    | "pcbBottomY"
    | "pcbOffsetX"
    | "pcbOffsetY"
    | "pcbRotation"
  > {
  route: RouteHintPointInput[]
  strokeWidth?: string | number
  color?: string
}

export const pcbNotePathProps = pcbLayoutProps
  .omit({
    pcbX: true,
    pcbY: true,
    pcbLeftX: true,
    pcbRightX: true,
    pcbTopY: true,
    pcbBottomY: true,
    pcbOffsetX: true,
    pcbOffsetY: true,
    pcbRotation: true,
  })
  .extend({
    route: z.array(route_hint_point),
    strokeWidth: length.optional(),
    color: z.string().optional(),
  })

expectTypesMatch<PcbNotePathProps, z.input<typeof pcbNotePathProps>>(true)

export type PcbNotePathPropsInput = z.input<typeof pcbNotePathProps>
