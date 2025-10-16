import {
  pcbLayoutProps,
  type CommonLayoutProps,
  type PcbLayoutProps,
} from "lib/common/layout"
import { z } from "zod"
import { distance, type Distance } from "lib/common/distance"
import { portHints, type PortHints } from "lib/common/portHints"
import { point, type Point } from "lib/common/point"
import { expectTypesMatch } from "lib/typecheck"

export interface RectSmtPadProps extends Omit<PcbLayoutProps, "pcbRotation"> {
  name?: string
  shape: "rect"
  width: Distance
  height: Distance
  rectBorderRadius?: Distance
  cornerRadius?:Distance
  portHints?: PortHints
  coveredWithSolderMask?: boolean
}

export interface RotatedRectSmtPadProps
  extends Omit<PcbLayoutProps, "pcbRotation"> {
  name?: string
  shape: "rotated_rect"
  width: Distance
  height: Distance
  cornerRadius?:Distance
  ccwRotation: number
  portHints?: PortHints
  coveredWithSolderMask?: boolean
}

export interface CircleSmtPadProps extends Omit<PcbLayoutProps, "pcbRotation"> {
  name?: string
  shape: "circle"
  radius: Distance
  portHints?: PortHints
  coveredWithSolderMask?: boolean
}

export interface PillSmtPadProps extends Omit<PcbLayoutProps, "pcbRotation"> {
  name?: string
  shape: "pill"
  width: Distance
  height: Distance
  radius: Distance
  portHints?: PortHints
  coveredWithSolderMask?: boolean
}

export interface PolygonSmtPadProps
  extends Omit<PcbLayoutProps, "pcbRotation"> {
  name?: string
  shape: "polygon"
  points: Point[]
  portHints?: PortHints
  coveredWithSolderMask?: boolean
}

export type SmtPadProps =
  | RectSmtPadProps
  | CircleSmtPadProps
  | RotatedRectSmtPadProps
  | PillSmtPadProps
  | PolygonSmtPadProps

// ----------------------------------------------------------------------------
// Zod
// ----------------------------------------------------------------------------

export const rectSmtPadProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    name: z.string().optional(),
    shape: z.literal("rect"),
    width: distance,
    height: distance,
    rectBorderRadius: distance.optional(),
    cornerRadius: distance.optional(),
    portHints: portHints.optional(),
    coveredWithSolderMask: z.boolean().optional(),
  })
type InferredRectSmtPadProps = z.input<typeof rectSmtPadProps>
expectTypesMatch<InferredRectSmtPadProps, RectSmtPadProps>(true)

export const rotatedRectSmtPadProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    name: z.string().optional(),
    shape: z.literal("rotated_rect"),
    width: distance,
    height: distance,
    ccwRotation: z.number(),
    cornerRadius: distance.optional(),
    portHints: portHints.optional(),
    coveredWithSolderMask: z.boolean().optional(),
  })
type InferredRotatedRectSmtPadProps = z.input<typeof rotatedRectSmtPadProps>
expectTypesMatch<InferredRotatedRectSmtPadProps, RotatedRectSmtPadProps>(true)

export const circleSmtPadProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    name: z.string().optional(),
    shape: z.literal("circle"),
    radius: distance,
    portHints: portHints.optional(),
    coveredWithSolderMask: z.boolean().optional(),
  })
type InferredCircleSmtPadProps = z.input<typeof circleSmtPadProps>
expectTypesMatch<InferredCircleSmtPadProps, CircleSmtPadProps>(true)

export const pillSmtPadProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    name: z.string().optional(),
    shape: z.literal("pill"),
    width: distance,
    height: distance,
    radius: distance,
    portHints: portHints.optional(),
    coveredWithSolderMask: z.boolean().optional(),
  })
type InferredPillSmtPadProps = z.input<typeof pillSmtPadProps>
expectTypesMatch<InferredPillSmtPadProps, PillSmtPadProps>(true)

export const polygonSmtPadProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    name: z.string().optional(),
    shape: z.literal("polygon"),
    points: z.array(point),
    portHints: portHints.optional(),
    coveredWithSolderMask: z.boolean().optional(),
  })
type InferredPolygonSmtPadProps = z.input<typeof polygonSmtPadProps>
expectTypesMatch<InferredPolygonSmtPadProps, PolygonSmtPadProps>(true)

export const smtPadProps = z.discriminatedUnion("shape", [
  circleSmtPadProps,
  rectSmtPadProps,
  rotatedRectSmtPadProps,
  pillSmtPadProps,
  polygonSmtPadProps,
])

export type InferredSmtPadProps = z.input<typeof smtPadProps>
expectTypesMatch<InferredSmtPadProps, SmtPadProps>(true)
