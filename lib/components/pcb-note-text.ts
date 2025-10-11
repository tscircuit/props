import { length } from "circuit-json"
import { pcbLayoutProps, type PcbLayoutProps } from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface PcbNoteTextProps extends PcbLayoutProps {
  text: string
  anchorAlignment?:
    | "center"
    | "top_left"
    | "top_right"
    | "bottom_left"
    | "bottom_right"
  font?: "tscircuit2024"
  fontSize?: string | number
  color?: string
}

export const pcbNoteTextProps = pcbLayoutProps.extend({
  text: z.string(),
  anchorAlignment: z
    .enum(["center", "top_left", "top_right", "bottom_left", "bottom_right"])
    .default("center"),
  font: z.enum(["tscircuit2024"]).optional(),
  fontSize: length.optional(),
  color: z.string().optional(),
})

expectTypesMatch<PcbNoteTextProps, z.input<typeof pcbNoteTextProps>>(true)

export type PcbNoteTextPropsInput = z.input<typeof pcbNoteTextProps>
