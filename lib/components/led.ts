import { z } from "zod"
import { commonComponentProps, lrPolarPins } from "../types/common"

export const ledProps = commonComponentProps.extend({
  color: z.string().optional(),
})
export const ledPins = lrPolarPins
export type LedProps = z.input<typeof ledProps>
import { z } from "zod"
import { commonLayoutProps } from "../types/common"

export const netAliasProps = commonLayoutProps.extend({
  net: z.string().optional(),
})
export type NetAliasProps = z.input<typeof netAliasProps>
import { z } from "zod"
import { distance, point, route_hint_point } from "@tscircuit/soup"

const portRef = z.union([
  z.string(),
  z.custom<{ getPortSelector: () => string }>((v) =>
    Boolean(v.getPortSelector),
  ),
])

export const traceProps = z
  .object({
    path: z.array(portRef),
    thickness: distance.optional(),
    schematicRouteHints: z.array(point).optional(),
    pcbRouteHints: z.array(route_hint_point).optional(),
  })
  .or(
    z.object({
      from: portRef,
      to: portRef,
      thickness: distance.optional(),
      schematicRouteHints: z.array(point).optional(),
      pcbRouteHints: z.array(route_hint_point).optional(),
    }),
  )
export type TraceProps = z.input<typeof traceProps>
import { z } from "zod"
import { pcbLayoutProps } from "../types/common"
import { distance } from "@tscircuit/soup"

export const holeProps = pcbLayoutProps.omit({ pcbRotation: true }).extend({
  holeDiameter: distance,
})
export type HoleProps = z.input<typeof holeProps>
import { z } from "zod"
import { pcbLayoutProps } from "../types/common"
import { distance, length, route_hint_point } from "@tscircuit/soup"

export const silkscreenTextProps = pcbLayoutProps.extend({
  text: z.string(),
  anchorAlignment: z
    .enum(["center", "top_left", "top_right", "bottom_left", "bottom_right"])
    .default("center"),
  font: z.enum(["tscircuit2024"]).optional(),
  fontSize: length.optional(),
})
export type SilkscreenTextProps = z.input<typeof silkscreenTextProps>

export const silkscreenPathProps = pcbLayoutProps
  .omit({ pcbX: true, pcbY: true, pcbRotation: true })
  .extend({
    route: z.array(route_hint_point),
    strokeWidth: length.optional(),
  })
export type SilkscreenPathProps = z.input<typeof silkscreenPathProps>

export const silkscreenLineProps = pcbLayoutProps
  .omit({ pcbX: true, pcbY: true, pcbRotation: true })
  .extend({
    strokeWidth: distance,
    x1: distance,
    y1: distance,
    x2: distance,
    y2: distance,
  })
export type SilkscreenLineProps = z.input<typeof silkscreenLineProps>

export const silkscreenRectProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    isFilled: z.boolean().optional(),
    isOutline: z.boolean().optional(),
    strokeWidth: distance.optional(),
    width: distance,
    height: distance,
  })
export type SilkscreenRectProps = z.input<typeof silkscreenRectProps>

export const silkscreenCircleProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    isFilled: z.boolean().optional(),
    isOutline: z.boolean().optional(),
    strokeWidth: distance.optional(),
    radius: distance,
  })
export type SilkscreenCircleProps = z.input<typeof silkscreenCircleProps>
