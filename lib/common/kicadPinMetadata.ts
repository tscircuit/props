import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export const kicadPinElectricalType = z.enum([
  "input",
  "output",
  "bidirectional",
  "tri_state",
  "passive",
  "free",
  "unspecified",
  "power_in",
  "power_out",
  "open_collector",
  "open_emitter",
  "no_connect",
])

export type KicadPinElectricalType = z.infer<typeof kicadPinElectricalType>

export const kicadPinGraphicStyle = z.enum([
  "line",
  "inverted",
  "clock",
  "inverted_clock",
  "input_low",
  "clock_low",
  "output_low",
  "falling_edge_clock",
  "nonlogic",
])

export type KicadPinGraphicStyle = z.infer<typeof kicadPinGraphicStyle>

export interface KicadPinMetadata {
  electricalType?: KicadPinElectricalType
  graphicStyle?: KicadPinGraphicStyle
  pinLength?: number | string
  nameTextSize?: number | string
  numberTextSize?: number | string
}

export const kicadPinMetadata = z.object({
  electricalType: kicadPinElectricalType.optional(),
  graphicStyle: kicadPinGraphicStyle.optional(),
  pinLength: z.union([z.number(), z.string()]).optional(),
  nameTextSize: z.union([z.number(), z.string()]).optional(),
  numberTextSize: z.union([z.number(), z.string()]).optional(),
})

type InferredKicadPinMetadata = z.input<typeof kicadPinMetadata>
expectTypesMatch<KicadPinMetadata, InferredKicadPinMetadata>(true)
