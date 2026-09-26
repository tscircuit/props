import { distance, layer_ref, type LayerRefInput } from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { point, type Point } from "./point"

export interface PcbPathPoint extends Point {
  /** Full width at this point, in mm or a distance string. Requires endWidth and widthInterpolationMode. */
  startWidth?: number | string
  /** Full width at the next path point (or the trace destination). */
  endWidth?: number | string
  /** Outgoing wire taper profile; no default. Not valid on a via entry. */
  widthInterpolationMode?: "linear" | "quadratic"
  via?: boolean
  fromLayer?: LayerRefInput
  toLayer?: LayerRefInput
}

const positiveWidth = distance.pipe(z.number().finite().positive())

const basePcbPathPoint = point.extend({
  startWidth: positiveWidth.optional(),
  endWidth: positiveWidth.optional(),
  widthInterpolationMode: z.enum(["linear", "quadratic"]).optional(),
  via: z.boolean().optional(),
  fromLayer: layer_ref.optional(),
  toLayer: layer_ref.optional(),
})

export const pcbPathPoint = basePcbPathPoint.superRefine((value, ctx) => {
  const taperFieldCount = [
    value.startWidth,
    value.endWidth,
    value.widthInterpolationMode,
  ].filter((field) => field !== undefined).length
  if (taperFieldCount > 0 && taperFieldCount !== 3) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        "startWidth, endWidth and widthInterpolationMode must be supplied together",
    })
  }
  if (taperFieldCount > 0 && value.via) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Wire taper fields are not allowed on via entries",
      path: ["via"],
    })
  }
  if (value.via) {
    if (!value.toLayer) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "toLayer is required when via is true",
        path: ["toLayer"],
      })
    }
  } else if (value.fromLayer || value.toLayer) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "fromLayer/toLayer are only allowed when via is true",
      path: ["via"],
    })
  }
})

export const pcbPath = z.array(z.union([pcbPathPoint, z.string()]))

export type PcbPath = Array<PcbPathPoint | string>

expectTypesMatch<PcbPathPoint, z.input<typeof pcbPathPoint>>(true)
expectTypesMatch<PcbPath, z.input<typeof pcbPath>>(true)
