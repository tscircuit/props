import { z } from "zod"
import { distance, type Distance } from "lib/common/distance"
import { point, type Point } from "lib/common/point"
import { pcbLayoutProps, type PcbLayoutProps } from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { layer_ref, type LayerRefInput } from "circuit-json"
import { brep_shape, type BRepShape } from "lib/common/brep"

export interface RectCopperPourProps extends Omit<PcbLayoutProps, "layer"> {
  shape: "rect"
  width: Distance
  height: Distance
  connectsTo?: string | string[]
  layer: LayerRefInput
}

export const rectCopperPourProps = pcbLayoutProps.extend({
  shape: z.literal("rect"),
  width: distance,
  height: distance,
  connectsTo: z.string().or(z.array(z.string())).optional(),
  layer: layer_ref,
})
expectTypesMatch<RectCopperPourProps, z.input<typeof rectCopperPourProps>>(true)

export interface PolygonCopperPourProps
  extends Omit<PcbLayoutProps, "layer" | "pcbRotation"> {
  shape: "polygon"
  points: Point[]
  connectsTo?: string | string[]
  layer: LayerRefInput
}

export const polygonCopperPourProps = pcbLayoutProps
  .omit({
    pcbRotation: true,
  })
  .extend({
    shape: z.literal("polygon"),
    points: z.array(point),
    connectsTo: z.string().or(z.array(z.string())).optional(),
    layer: layer_ref,
  })
expectTypesMatch<
  PolygonCopperPourProps,
  z.input<typeof polygonCopperPourProps>
>(true)

export interface BRepCopperPourProps
  extends Omit<PcbLayoutProps, "layer" | "pcbRotation"> {
  shape: "brep"
  brepShape: BRepShape
  connectsTo?: string | string[]
  layer: LayerRefInput
}

export const brepCopperPourProps = pcbLayoutProps
  .omit({
    pcbRotation: true,
  })
  .extend({
    shape: z.literal("brep"),
    brepShape: brep_shape,
    connectsTo: z.string().or(z.array(z.string())).optional(),
    layer: layer_ref,
  })
expectTypesMatch<BRepCopperPourProps, z.input<typeof brepCopperPourProps>>(true)

export type CopperPourProps =
  | RectCopperPourProps
  | PolygonCopperPourProps
  | BRepCopperPourProps

export const copperPourProps = z.discriminatedUnion("shape", [
  rectCopperPourProps,
  polygonCopperPourProps,
  brepCopperPourProps,
])

export type CopperPourPropsInput = z.input<typeof copperPourProps>
