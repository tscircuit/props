import { distance } from "circuit-json"
import type { PcbLayoutProps } from "lib/common/layout"
import { pcbLayoutProps } from "lib/common/layout"
import { type PortHints, portHints } from "lib/common/portHints"
import { point, type Point } from "lib/common/point"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import type { Distance } from "lib/common/distance"

export interface CirclePlatedHoleProps
  extends Omit<PcbLayoutProps, "pcbRotation" | "layer"> {
  name?: string
  connectsTo?: string | string[]
  shape: "circle"
  holeDiameter: number | string
  outerDiameter: number | string
  portHints?: PortHints
  solderMaskMargin?: Distance
}

export interface OvalPlatedHoleProps extends Omit<PcbLayoutProps, "layer"> {
  name?: string
  connectsTo?: string | string[]
  shape: "oval"
  outerWidth: number | string
  outerHeight: number | string
  holeWidth: number | string
  holeHeight: number | string
  portHints?: PortHints
  solderMaskMargin?: Distance

  /** @deprecated use holeWidth */
  innerWidth?: number | string
  /** @deprecated use holeHeight */
  innerHeight?: number | string
}

export interface PillPlatedHoleProps extends Omit<PcbLayoutProps, "layer"> {
  name?: string
  rectPad?: boolean
  connectsTo?: string | string[]
  shape: "pill"
  outerWidth: number | string
  outerHeight: number | string
  holeWidth: number | string
  holeHeight: number | string
  holeOffsetX?: number | string
  holeOffsetY?: number | string

  /** @deprecated use holeWidth */
  innerWidth?: number | string
  /** @deprecated use holeHeight */
  innerHeight?: number | string

  portHints?: PortHints
  solderMaskMargin?: Distance
}

export interface CircularHoleWithRectPlatedProps
  extends Omit<PcbLayoutProps, "pcbRotation" | "layer"> {
  name?: string
  connectsTo?: string | string[]
  shape: "circular_hole_with_rect_pad"
  holeDiameter: number | string
  rectPadWidth: number | string
  rectPadHeight: number | string
  rectBorderRadius?: number | string
  holeShape?: "circle"
  padShape?: "rect"
  portHints?: PortHints
  holeOffsetX?: number | string
  holeOffsetY?: number | string
  solderMaskMargin?: Distance
}

export interface PillWithRectPadPlatedHoleProps
  extends Omit<PcbLayoutProps, "pcbRotation" | "layer"> {
  name?: string
  connectsTo?: string | string[]
  shape: "pill_hole_with_rect_pad"
  holeShape: "pill"
  padShape: "rect"
  holeWidth: number | string
  holeHeight: number | string
  rectPadWidth: number | string
  rectPadHeight: number | string
  portHints?: PortHints
  holeOffsetX?: number | string
  holeOffsetY?: number | string
  solderMaskMargin?: Distance
}

export interface HoleWithPolygonPadPlatedHoleProps
  extends Omit<PcbLayoutProps, "pcbRotation" | "layer"> {
  name?: string
  connectsTo?: string | string[]
  shape: "hole_with_polygon_pad"
  holeShape: "circle" | "oval" | "pill" | "rotated_pill"
  holeDiameter?: number | string
  holeWidth?: number | string
  holeHeight?: number | string
  padOutline: Point[]
  holeOffsetX: number | string
  holeOffsetY: number | string
  portHints?: PortHints
  solderMaskMargin?: Distance
}

export type PlatedHoleProps =
  | CirclePlatedHoleProps
  | OvalPlatedHoleProps
  | PillPlatedHoleProps
  | CircularHoleWithRectPlatedProps
  | PillWithRectPadPlatedHoleProps
  | HoleWithPolygonPadPlatedHoleProps

const distanceHiddenUndefined = z
  .custom<z.input<typeof distance>>()
  .transform((a) => {
    if (a === undefined) return undefined
    return distance.parse(a)
  })

export const platedHoleProps = z
  .discriminatedUnion("shape", [
    pcbLayoutProps.omit({ pcbRotation: true, layer: true }).extend({
      name: z.string().optional(),
      connectsTo: z.string().or(z.array(z.string())).optional(),
      shape: z.literal("circle"),
      holeDiameter: distance,
      outerDiameter: distance,
      portHints: portHints.optional(),
      solderMaskMargin: distance.optional(),
    }),
    pcbLayoutProps.omit({ layer: true }).extend({
      name: z.string().optional(),
      connectsTo: z.string().or(z.array(z.string())).optional(),
      shape: z.literal("oval"),
      outerWidth: distance,
      outerHeight: distance,
      holeWidth: distanceHiddenUndefined,
      holeHeight: distanceHiddenUndefined,
      innerWidth: distance.optional().describe("DEPRECATED use holeWidth"),
      innerHeight: distance.optional().describe("DEPRECATED use holeHeight"),
      portHints: portHints.optional(),
      solderMaskMargin: distance.optional(),
    }),
    pcbLayoutProps.omit({ layer: true }).extend({
      name: z.string().optional(),
      connectsTo: z.string().or(z.array(z.string())).optional(),
      shape: z.literal("pill"),
      rectPad: z.boolean().optional(),
      outerWidth: distance,
      outerHeight: distance,
      holeWidth: distanceHiddenUndefined,
      holeHeight: distanceHiddenUndefined,
      innerWidth: distance.optional().describe("DEPRECATED use holeWidth"),
      innerHeight: distance.optional().describe("DEPRECATED use holeHeight"),
      portHints: portHints.optional(),
      holeOffsetX: distance.optional(),
      holeOffsetY: distance.optional(),
      solderMaskMargin: distance.optional(),
    }),
    pcbLayoutProps.omit({ pcbRotation: true, layer: true }).extend({
      name: z.string().optional(),
      connectsTo: z.string().or(z.array(z.string())).optional(),
      shape: z.literal("circular_hole_with_rect_pad"),
      holeDiameter: distance,
      rectPadWidth: distance,
      rectPadHeight: distance,
      rectBorderRadius: distance.optional(),
      holeShape: z.literal("circle").optional(),
      padShape: z.literal("rect").optional(),
      portHints: portHints.optional(),
      holeOffsetX: distance.optional(),
      holeOffsetY: distance.optional(),
      solderMaskMargin: distance.optional(),
    }),
    pcbLayoutProps.omit({ pcbRotation: true, layer: true }).extend({
      name: z.string().optional(),
      connectsTo: z.string().or(z.array(z.string())).optional(),
      shape: z.literal("pill_hole_with_rect_pad"),
      holeShape: z.literal("pill"),
      padShape: z.literal("rect"),
      holeWidth: distance,
      holeHeight: distance,
      rectPadWidth: distance,
      rectPadHeight: distance,
      portHints: portHints.optional(),
      holeOffsetX: distance.optional(),
      holeOffsetY: distance.optional(),
      solderMaskMargin: distance.optional(),
    }),
    pcbLayoutProps.omit({ pcbRotation: true, layer: true }).extend({
      name: z.string().optional(),
      connectsTo: z.string().or(z.array(z.string())).optional(),
      shape: z.literal("hole_with_polygon_pad"),
      holeShape: z.enum(["circle", "oval", "pill", "rotated_pill"]),
      holeDiameter: distance.optional(),
      holeWidth: distance.optional(),
      holeHeight: distance.optional(),
      padOutline: z.array(point),
      holeOffsetX: distance,
      holeOffsetY: distance,
      portHints: portHints.optional(),
      solderMaskMargin: distance.optional(),
    }),
  ])
  .refine((a) => {
    if ("innerWidth" in a && a.innerWidth !== undefined) {
      a.holeWidth ??= a.innerWidth
    }
    if ("innerHeight" in a && a.innerHeight !== undefined) {
      a.holeHeight ??= a.innerHeight
    }
    return a
  })

type InferredPlatedHoleProps = z.input<typeof platedHoleProps>

expectTypesMatch<PlatedHoleProps, InferredPlatedHoleProps>(true)
