import { z } from "zod"
import { distance, type Distance } from "lib/common/distance"
import { point, type Point } from "lib/common/point"
import { pcbLayoutProps, type PcbLayoutProps } from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"

export interface RectCopperPourProps
  extends Omit<PcbLayoutProps, "pcbRotation"> {
  shape: "rect"
  width: Distance
  height: Distance
  connectsTo?: string | string[]
}

export const rectCopperPourProps = pcbLayoutProps
  .omit({
    pcbRotation: true,
  })
  .extend({
    shape: z.literal("rect"),
    width: distance,
    height: distance,
    connectsTo: z.string().or(z.array(z.string())).optional(),
  })
expectTypesMatch<RectCopperPourProps, z.input<typeof rectCopperPourProps>>(true)

export interface CircleCopperPourProps
  extends Omit<PcbLayoutProps, "pcbRotation"> {
  shape: "circle"
  radius: Distance
  connectsTo?: string | string[]
}

export const circleCopperPourProps = pcbLayoutProps
  .omit({
    pcbRotation: true,
  })
  .extend({
    shape: z.literal("circle"),
    radius: distance,
    connectsTo: z.string().or(z.array(z.string())).optional(),
  })
expectTypesMatch<CircleCopperPourProps, z.input<typeof circleCopperPourProps>>(
  true,
)

export interface PolygonCopperPourProps
  extends Omit<PcbLayoutProps, "pcbRotation"> {
  shape: "polygon"
  points: Point[]
  connectsTo?: string | string[]
}

export const polygonCopperPourProps = pcbLayoutProps
  .omit({
    pcbRotation: true,
  })
  .extend({
    shape: z.literal("polygon"),
    points: z.array(point),
    connectsTo: z.string().or(z.array(z.string())).optional(),
  })
expectTypesMatch<
  PolygonCopperPourProps,
  z.input<typeof polygonCopperPourProps>
>(true)

export type CopperPourProps =
  | RectCopperPourProps
  | CircleCopperPourProps
  | PolygonCopperPourProps

export const copperPourProps = z.discriminatedUnion("shape", [
  rectCopperPourProps,
  circleCopperPourProps,
  polygonCopperPourProps,
])

export type CopperPourPropsInput = z.input<typeof copperPourProps>
