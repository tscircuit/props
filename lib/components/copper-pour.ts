import { z } from "zod"
import { distance, type Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import { layer_ref, type LayerRefInput } from "circuit-json"
import { point } from "lib/common/point"

export const pourRegion = z.discriminatedUnion("strategy", [
  z.object({
    strategy: z.literal("polygon"),
    points: z.array(point),
  }),
  z.object({
    strategy: z.literal("rect"),
    x: distance,
    y: distance,
    width: distance,
    height: distance,
  }),
  z.object({
    strategy: z.literal("boardOutline"),
  }),
  z.object({
    strategy: z.literal("aroundComponents"),
    refDes: z.array(z.string()),
  }),
])

export type PourRegion = z.input<typeof pourRegion>

export const pourCutout = z.discriminatedUnion("strategy", [
  z.object({
    strategy: z.literal("polygon"),
    points: z.array(point),
  }),
  z.object({
    strategy: z.literal("circle"),
    cx: distance,
    cy: distance,
    r: distance,
  }),
  z.object({
    strategy: z.literal("rect"),
    x: distance,
    y: distance,
    width: distance,
    height: distance,
  }),
])

export type PourCutout = z.input<typeof pourCutout>

export interface CopperPourProps {
  name?: string
  layer: LayerRefInput
  connectsTo: string
  padMargin?: Distance
  traceMargin?: Distance
  pourablePortSelectors?: string[]
  region: PourRegion
  cutouts?: PourCutout[]
}

export const copperPourProps = z.object({
  name: z.string().optional(),
  layer: layer_ref,
  connectsTo: z.string(),
  padMargin: distance.optional(),
  traceMargin: distance.optional(),
  pourablePortSelectors: z.array(z.string()).optional(),
  region: pourRegion,
  cutouts: z.array(pourCutout).optional(),
})

expectTypesMatch<CopperPourProps, z.input<typeof copperPourProps>>(true)

export type CopperPourPropsInput = z.input<typeof copperPourProps>
