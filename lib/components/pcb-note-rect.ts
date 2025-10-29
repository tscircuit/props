import { distance } from "circuit-json"
import { pcbLayoutProps, type PcbLayoutProps } from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface PcbNoteRectProps extends Omit<PcbLayoutProps, "pcbRotation"> {
  width: string | number
  height: string | number
  strokeWidth?: string | number
  isFilled?: boolean
  hasStroke?: boolean
  isStrokeDashed?: boolean
  color?: string
  cornerRadius?: string | number
}

export const pcbNoteRectProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    width: distance,
    height: distance,
    strokeWidth: distance.optional(),
    isFilled: z.boolean().optional(),
    hasStroke: z.boolean().optional(),
    isStrokeDashed: z.boolean().optional(),
    color: z.string().optional(),
    cornerRadius: distance.optional(),
  })

expectTypesMatch<PcbNoteRectProps, z.input<typeof pcbNoteRectProps>>(true)

export type PcbNoteRectPropsInput = z.input<typeof pcbNoteRectProps>
