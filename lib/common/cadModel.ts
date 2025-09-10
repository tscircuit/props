import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"
import { distance, type Distance } from "./distance"
import { point3 } from "./point3"

export const rotationPoint3 = z.object({
  x: z.union([z.number(), z.string()]),
  y: z.union([z.number(), z.string()]),
  z: z.union([z.number(), z.string()]),
})

export interface CadModelBase {
  rotationOffset?:
    | number
    | { x: number | string; y: number | string; z: number | string }
  positionOffset?: {
    x: number | string
    y: number | string
    z: number | string
  }
  size?: { x: number | string; y: number | string; z: number | string }
  modelUnitToMmScale?: Distance
}

export const cadModelBase = z.object({
  rotationOffset: z.number().or(rotationPoint3).optional(),
  positionOffset: point3.optional(),
  size: point3.optional(),
  modelUnitToMmScale: distance.optional(),
})

expectTypesMatch<CadModelBase, z.input<typeof cadModelBase>>(true)

export interface CadModelStl extends CadModelBase {
  stlUrl: string
}
export const cadModelStl = cadModelBase.extend({
  stlUrl: z.string(),
})

export interface CadModelObj extends CadModelBase {
  objUrl: string
  mtlUrl?: string
}
export const cadModelObj = cadModelBase.extend({
  objUrl: z.string(),
  mtlUrl: z.string().optional(),
})

export interface CadModelGltf extends CadModelBase {
  gltfUrl: string
}
export const cadModelGltf = cadModelBase.extend({
  gltfUrl: z.string(),
})

export interface CadModelGlb extends CadModelBase {
  glbUrl: string
}
export const cadModelGlb = cadModelBase.extend({
  glbUrl: z.string(),
})

export interface CadModelStep extends CadModelBase {
  stepUrl: string
}
export const cadModelStep = cadModelBase.extend({
  stepUrl: z.string(),
})

export interface CadModelWrl extends CadModelBase {
  wrlUrl: string
}
export const cadModelWrl = cadModelBase.extend({
  wrlUrl: z.string(),
})

export interface CadModelJscad extends CadModelBase {
  jscad: Record<string, any>
}
export const cadModelJscad = cadModelBase.extend({
  jscad: z.record(z.any()),
})

export type CadModelProp =
  | null
  | string
  | CadModelStl
  | CadModelObj
  | CadModelGltf
  | CadModelGlb
  | CadModelStep
  | CadModelWrl
  | CadModelJscad

export const cadModelProp = z.union([
  z.null(),
  z.string(),
  cadModelStl,
  cadModelObj,
  cadModelGltf,
  cadModelGlb,
  cadModelStep,
  cadModelWrl,
  cadModelJscad,
])

type InferredCadModelProp = z.input<typeof cadModelProp>
expectTypesMatch<CadModelProp, InferredCadModelProp>(true)
