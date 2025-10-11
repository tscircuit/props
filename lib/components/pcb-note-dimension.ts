import { distance, length } from "circuit-json"
import { pcbLayoutProps, type PcbLayoutProps } from "lib/common/layout"
import { point, type Point } from "lib/common/point"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

const dimensionTarget = z.union([z.string(), point])

export interface PcbNoteDimensionProps
  extends Omit<PcbLayoutProps, "pcbX" | "pcbY" | "pcbRotation"> {
  from: string | Point
  to: string | Point
  text?: string
  offset?: string | number
  font?: "tscircuit2024"
  fontSize?: string | number
  color?: string
  arrowSize?: string | number
}

export const pcbNoteDimensionProps = pcbLayoutProps
  .omit({ pcbX: true, pcbY: true, pcbRotation: true })
  .extend({
    from: dimensionTarget,
    to: dimensionTarget,
    text: z.string().optional(),
    offset: distance.optional(),
    font: z.enum(["tscircuit2024"]).optional(),
    fontSize: length.optional(),
    color: z.string().optional(),
    arrowSize: distance.optional(),
  })

expectTypesMatch<PcbNoteDimensionProps, z.input<typeof pcbNoteDimensionProps>>(
  true,
)

export type PcbNoteDimensionPropsInput = z.input<typeof pcbNoteDimensionProps>
