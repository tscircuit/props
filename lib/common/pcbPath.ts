import { layer_ref, type LayerRefInput } from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { point, type Point } from "./point"

export interface PcbPathPoint extends Point {
  via?: boolean
  fromLayer?: LayerRefInput
  toLayer?: LayerRefInput
}

const basePcbPathPoint = point.extend({
  via: z.boolean().optional(),
  fromLayer: layer_ref.optional(),
  toLayer: layer_ref.optional(),
})

export const pcbPathPoint = basePcbPathPoint.superRefine((value, ctx) => {
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
