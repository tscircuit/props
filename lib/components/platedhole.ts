import { distance } from "circuit-json"
import type { PcbLayoutProps } from "lib/common/layout"
import { pcbLayoutProps } from "lib/common/layout"
import { type PortHints, portHints } from "lib/common/portHints"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface CirclePlatedHoleProps
  extends Omit<PcbLayoutProps, "pcbRotation" | "layer"> {
  name?: string
  shape: "circle"
  holeDiameter: number | string
  outerDiameter: number | string
  portHints?: PortHints
}

export interface OvalPlatedHoleProps
  extends Omit<PcbLayoutProps, "pcbRotation" | "layer"> {
  name?: string
  shape: "oval"
  outerWidth: number | string
  outerHeight: number | string
  holeWidth: number | string
  holeHeight: number | string
  portHints?: PortHints

  /** @deprecated use holeWidth */
  innerWidth?: number | string
  /** @deprecated use holeHeight */
  innerHeight?: number | string
}

export interface PillPlatedHoleProps
  extends Omit<PcbLayoutProps, "pcbRotation" | "layer"> {
  name?: string
  shape: "pill"
  outerWidth: number | string
  outerHeight: number | string
  holeWidth: number | string
  holeHeight: number | string

  /** @deprecated use holeWidth */
  innerWidth?: number | string
  /** @deprecated use holeHeight */
  innerHeight?: number | string

  portHints?: PortHints
}

export interface CircularHoleWithRectPlatedProps
  extends Omit<PcbLayoutProps, "pcbRotation" | "layer"> {
  name?: string
  holeDiameter: number | string
  rectPadWidth: number | string
  rectPadHeight: number | string
  holeShape?: "circle"
  padShape?: "rect"
  shape?: "circular_hole_with_rect_pad"
  portHints?: PortHints
}

export type PlatedHoleProps =
  | CirclePlatedHoleProps
  | OvalPlatedHoleProps
  | PillPlatedHoleProps
  | CircularHoleWithRectPlatedProps

const distanceHiddenUndefined = z
  .custom<z.input<typeof distance>>()
  .transform((a) => {
    if (a === undefined) return undefined
    return distance.parse(a)
  })

export const platedHoleProps = z
  .union([
    pcbLayoutProps.omit({ pcbRotation: true, layer: true }).extend({
      name: z.string().optional(),
      shape: z.literal("circle"),
      holeDiameter: distance,
      outerDiameter: distance,
      portHints: portHints.optional(),
    }),
    pcbLayoutProps.omit({ pcbRotation: true, layer: true }).extend({
      name: z.string().optional(),
      shape: z.literal("oval"),
      outerWidth: distance,
      outerHeight: distance,
      holeWidth: distanceHiddenUndefined,
      holeHeight: distanceHiddenUndefined,
      innerWidth: distance.optional().describe("DEPRECATED use holeWidth"),
      innerHeight: distance.optional().describe("DEPRECATED use holeHeight"),
      portHints: portHints.optional(),
    }),
    pcbLayoutProps.omit({ pcbRotation: true, layer: true }).extend({
      name: z.string().optional(),
      shape: z.literal("pill"),
      outerWidth: distance,
      outerHeight: distance,
      holeWidth: distanceHiddenUndefined,
      holeHeight: distanceHiddenUndefined,
      innerWidth: distance.optional().describe("DEPRECATED use holeWidth"),
      innerHeight: distance.optional().describe("DEPRECATED use holeHeight"),
      portHints: portHints.optional(),
    }),
    pcbLayoutProps
      .omit({ pcbRotation: true, layer: true })
      .extend({
        name: z.string().optional(),
        holeDiameter: distance,
        rectPadWidth: distance,
        rectPadHeight: distance,
        holeShape: z.literal("circle").optional(),
        padShape: z.literal("rect").optional(),
        shape: z.literal("circular_hole_with_rect_pad").optional(),
        portHints: portHints.optional(),
      })
      .refine(
        (prop) => {
          return prop.shape === "circular_hole_with_rect_pad"
            ? prop.holeDiameter && prop.rectPadWidth && prop.rectPadHeight
            : true
        },
        {
          message: "Missing required fields for circular_hole_with_rect_pad",
        },
      ),
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
