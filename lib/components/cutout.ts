import { z } from "zod"
import { distance, type Distance } from "lib/common/distance"
import { point, type Point } from "lib/common/point"
import { pcbLayoutProps, type PcbLayoutProps } from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"

export interface RectCutoutProps
  extends Omit<PcbLayoutProps, "layer" | "pcbRotation"> {
  name?: string
  shape: "rect"
  width: Distance
  height: Distance
}

export const rectCutoutProps = pcbLayoutProps
  .omit({
    layer: true,
    pcbRotation: true,
  })
  .extend({
    name: z.string().optional(),
    shape: z.literal("rect"),
    width: distance,
    height: distance,
  })
expectTypesMatch<RectCutoutProps, z.input<typeof rectCutoutProps>>(true)

export interface CircleCutoutProps
  extends Omit<PcbLayoutProps, "layer" | "pcbRotation"> {
  name?: string
  shape: "circle"
  radius: Distance
}

export const circleCutoutProps = pcbLayoutProps
  .omit({
    layer: true,
    pcbRotation: true,
  })
  .extend({
    name: z.string().optional(),
    shape: z.literal("circle"),
    radius: distance,
  })
expectTypesMatch<CircleCutoutProps, z.input<typeof circleCutoutProps>>(true)

export interface PolygonCutoutProps
  extends Omit<PcbLayoutProps, "layer" | "pcbRotation"> {
  name?: string
  shape: "polygon"
  points: Point[]
}

export const polygonCutoutProps = pcbLayoutProps
  .omit({
    layer: true,
    pcbRotation: true,
  })
  .extend({
    name: z.string().optional(),
    shape: z.literal("polygon"),
    points: z.array(point),
  })
expectTypesMatch<PolygonCutoutProps, z.input<typeof polygonCutoutProps>>(true)

export type CutoutProps =
  | RectCutoutProps
  | CircleCutoutProps
  | PolygonCutoutProps

export const cutoutProps = z.discriminatedUnion("shape", [
  rectCutoutProps,
  circleCutoutProps,
  polygonCutoutProps,
])

export type CutoutPropsInput = z.input<typeof cutoutProps>
