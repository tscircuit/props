import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"
import { distance, type Distance } from "./distance"
import { point3 } from "./point3"
import { url } from "./url"
import type { ReactElement } from "react"

export const rotationPoint3 = z.object({
  x: z.union([z.number(), z.string()]),
  y: z.union([z.number(), z.string()]),
  z: z.union([z.number(), z.string()]),
})

export const cadModelAxisDirections = [
  "x+",
  "x-",
  "y+",
  "y-",
  "z+",
  "z-",
] as const

export type CadModelAxisDirection = (typeof cadModelAxisDirections)[number]

export const cadModelAxisDirection = z.enum(cadModelAxisDirections)

export interface CadModelBase {
  rotationOffset?:
    | number
    | { x: number | string; y: number | string; z: number | string }
  positionOffset?: {
    x: number | string
    y: number | string
    z: number | string
  }
  modelOriginPosition?: {
    x: number | string
    y: number | string
    z: number | string
  }
  /**
   * Axis-aligned extent of the model measured in its own coordinate frame, the
   * same frame as `modelOriginPosition`.
   *
   * `size` gives the extent but not where the box sits relative to the model
   * origin, and the box is generally not centered on it, so `size` alone cannot
   * say how much of the part is above the board. Since `modelOriginPosition` is
   * the point placed on the board surface, these bounds supply the missing
   * term. `modelBoardNormalDirection` names the axis (default `z+`): for a
   * positive normal the outward reach is `max[axis] - origin[axis]`, and for a
   * negative one it is `origin[axis] - min[axis]`.
   *
   * These are the model's own bounds, before `modelUnitToMmScale` or any
   * object-fit scaling is applied.
   *
   * Whatever generates a part file already measures this to produce `size`.
   */
  modelBounds?: {
    min: { x: number | string; y: number | string; z: number | string }
    max: { x: number | string; y: number | string; z: number | string }
  }
  size?: { x: number | string; y: number | string; z: number | string }
  modelUnitToMmScale?: Distance
  modelBoardNormalDirection?: CadModelAxisDirection
  pcbRotationOffset?: number
  zOffsetFromSurface?: Distance
  showAsTranslucentModel?: boolean
  stepUrl?: string
}

export const cadModelBase = z.object({
  rotationOffset: z.number().or(rotationPoint3).optional(),
  positionOffset: point3.optional(),
  modelOriginPosition: point3.optional(),
  modelBounds: z.object({ min: point3, max: point3 }).optional(),
  size: point3.optional(),
  modelUnitToMmScale: distance.optional(),
  modelBoardNormalDirection: cadModelAxisDirection.optional(),
  pcbRotationOffset: z.number().optional(),
  zOffsetFromSurface: distance.optional(),
  showAsTranslucentModel: z.boolean().optional(),
  stepUrl: url.optional(),
})

expectTypesMatch<CadModelBase, z.input<typeof cadModelBase>>(true)

export interface CadModelStl extends CadModelBase {
  stlUrl: string
}
export const cadModelStl = cadModelBase.extend({
  stlUrl: url,
})

export interface CadModelObj extends CadModelBase {
  objUrl: string
  mtlUrl?: string
}
export const cadModelObj = cadModelBase.extend({
  objUrl: url,
  mtlUrl: url.optional(),
})

export interface CadModelGltf extends CadModelBase {
  gltfUrl: string
}
export const cadModelGltf = cadModelBase.extend({
  gltfUrl: url,
})

export interface CadModelGlb extends CadModelBase {
  glbUrl: string
}
export const cadModelGlb = cadModelBase.extend({
  glbUrl: url,
})

export interface CadModelStep extends CadModelBase {
  stepUrl: string
}
export const cadModelStep = cadModelBase.extend({
  stepUrl: url,
})

export interface CadModelWrl extends CadModelBase {
  wrlUrl: string
}
export const cadModelWrl = cadModelBase.extend({
  wrlUrl: url,
})

export interface CadModelJscad extends CadModelBase {
  jscad: Record<string, any>
}
export const cadModelJscad = cadModelBase.extend({
  jscad: z.record(z.any()),
})

/**
 * A Footprinter string used to procedurally generate the component's CAD model,
 * independently of the component's PCB footprint.
 *
 * @example "soic8"
 */
export type CadModelFootprinterString = string

export type CadModelProp =
  | null
  | ReactElement
  | CadModelFootprinterString
  | CadModelStl
  | CadModelObj
  | CadModelGltf
  | CadModelGlb
  | CadModelStep
  | CadModelWrl
  | CadModelJscad

export const cadModelProp = z.union([
  z.null(),
  z.string().min(1),
  z.custom<ReactElement>((v) => {
    return v && typeof v === "object" && "type" in v && "props" in v
  }),
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
