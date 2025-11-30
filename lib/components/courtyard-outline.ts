import { length } from "circuit-json"
import { pcbLayoutProps } from "lib/common/layout"
import { point } from "lib/common/point"
import { z } from "zod"

export const courtyardOutlineProps = pcbLayoutProps
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
    outline: z.array(point),
    strokeWidth: length.optional(),
    isClosed: z.boolean().optional(),
    isStrokeDashed: z.boolean().optional(),
    color: z.string().optional(),
  })
export type CourtyardOutlineProps = z.input<typeof courtyardOutlineProps>
