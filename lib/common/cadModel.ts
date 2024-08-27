import { z } from "zod"
import { point3 } from "./point3"

export const rotationPoint3 = z.object({
  x: z.union([z.number(), z.string()]),
  y: z.union([z.number(), z.string()]),
  z: z.union([z.number(), z.string()]),
})

export const cadModelBase = z.object({
  rotationOffset: z.number().or(rotationPoint3).optional(),
  positionOffset: point3.optional(),
  size: point3.optional(),
})

export const cadModelStl = cadModelBase.extend({
  stlUrl: z.string(),
})

export const cadModelObj = cadModelBase.extend({
  objUrl: z.string(),
  mtlUrl: z.string().optional(),
})

export const cadModelJscad = cadModelBase.extend({
  jscad: z.any(),
})
