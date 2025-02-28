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
  innerWidth: number | string
  innerHeight: number | string
  portHints?: PortHints
}

export interface PillPlatedHoleProps
  extends Omit<PcbLayoutProps, "pcbRotation" | "layer"> {
  name?: string
  shape: "pill"
  outerWidth: number | string
  outerHeight: number | string
  innerWidth: number | string
  innerHeight: number | string
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
  shape?: "circularHoleWithRectPad"
  portHints?: PortHints
}

export type PlatedHoleProps =
  | CirclePlatedHoleProps
  | OvalPlatedHoleProps
  | PillPlatedHoleProps
  | CircularHoleWithRectPlatedProps

export const platedHoleProps = z.union([
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
    innerWidth: distance,
    innerHeight: distance,
    portHints: portHints.optional(),
  }),
  pcbLayoutProps.omit({ pcbRotation: true, layer: true }).extend({
    name: z.string().optional(),
    shape: z.literal("pill"),
    outerWidth: distance,
    outerHeight: distance,
    innerWidth: distance,
    innerHeight: distance,
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
      shape: z.literal("circularHoleWithRectPad").optional(),
      portHints: portHints.optional(),
    })
    .refine(
      (prop) => {
        return prop.shape === "circularHoleWithRectPad"
          ? prop.holeDiameter && prop.rectPadWidth && prop.rectPadHeight
          : true
      },
      {
        message: "Missing required fields for circularHoleWithRectPad",
      },
    ),
])

type InferredPlatedHoleProps = z.input<typeof platedHoleProps>

expectTypesMatch<PlatedHoleProps, InferredPlatedHoleProps>(true)
