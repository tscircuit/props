import { z } from "zod"
import { pcbLayoutProps } from "lib/common/layout"
import { distance } from "@tscircuit/soup"
import { portHints, type PortHints } from "lib/common/portHints"
import { expectTypesMatch } from "lib/typecheck"
import type { PcbLayoutProps } from "lib/common/layout"

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

export type PlatedHoleProps =
  | CirclePlatedHoleProps
  | OvalPlatedHoleProps
  | PillPlatedHoleProps

export const platedHoleProps = z.discriminatedUnion("shape", [
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
])

type InferredPlatedHoleProps = z.input<typeof platedHoleProps>
expectTypesMatch<PlatedHoleProps, InferredPlatedHoleProps>(true)
