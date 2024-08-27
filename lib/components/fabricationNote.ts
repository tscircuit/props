import { z } from "zod"
import { pcbLayoutProps } from "../types/common"
import { length, route_hint_point } from "@tscircuit/soup"

export const fabricationNoteTextProps = pcbLayoutProps.extend({
  text: z.string(),
  anchorAlignment: z
    .enum(["center", "top_left", "top_right", "bottom_left", "bottom_right"])
    .default("center"),
  font: z.enum(["tscircuit2024"]).optional(),
  fontSize: length.optional(),
})
export type FabricationNoteTextProps = z.input<typeof fabricationNoteTextProps>

export const fabricationNotePathProps = pcbLayoutProps
  .omit({ pcbX: true, pcbY: true, pcbRotation: true })
  .extend({
    route: z.array(route_hint_point),
    strokeWidth: length.optional(),
  })
export type FabricationNotePathProps = z.input<typeof fabricationNotePathProps>
