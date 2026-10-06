import { distance, length } from "circuit-json"
import { pcbLayoutProps, type PcbLayoutProps } from "lib/common/layout"
import { point, type Point } from "lib/common/point"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

const dimensionTarget = z.union([z.string(), point])

export interface FabricationNoteDimensionProps
  extends Omit<
    PcbLayoutProps,
    | "pcbLeftEdgeX"
    | "pcbRightEdgeX"
    | "pcbTopEdgeY"
    | "pcbBottomEdgeY"
    | "pcbX"
    | "pcbY"
    | "pcbOffsetX"
    | "pcbOffsetY"
    | "pcbRotation"
  > {
  from: string | Point
  to: string | Point
  text?: string
  /** Offset distance in mm, or a unit-bearing string. Defaults to no offset. */
  offset?: string | number
  /**
   * Unitless direction in footprint-local coordinates (+X right, +Y up).
   * Preserved as supplied; omitted uses the perpendicular to from -> to.
   * The direction rotates/mirrors with the footprint, without translation.
   */
  offsetDirection?: { x: number; y: number }
  font?: "tscircuit2024"
  fontSize?: string | number
  color?: string
  arrowSize?: string | number
  units?: "in" | "mm"
  outerEdgeToEdge?: true
  centerToCenter?: true
  innerEdgeToEdge?: true
}

export const fabricationNoteDimensionProps = pcbLayoutProps
  .omit({
    pcbLeftEdgeX: true,
    pcbRightEdgeX: true,
    pcbTopEdgeY: true,
    pcbBottomEdgeY: true,
    pcbX: true,
    pcbY: true,
    pcbOffsetX: true,
    pcbOffsetY: true,
    pcbRotation: true,
  })
  .extend({
    from: dimensionTarget,
    to: dimensionTarget,
    text: z.string().optional(),
    offset: distance.optional(),
    offsetDirection: z
      .object({ x: z.number().finite(), y: z.number().finite() })
      .optional(),
    font: z.enum(["tscircuit2024"]).optional(),
    fontSize: length.optional(),
    color: z.string().optional(),
    arrowSize: distance.optional(),
    units: z.enum(["in", "mm"]).optional(),
    outerEdgeToEdge: z.literal(true).optional(),
    centerToCenter: z.literal(true).optional(),
    innerEdgeToEdge: z.literal(true).optional(),
  })

expectTypesMatch<
  FabricationNoteDimensionProps,
  z.input<typeof fabricationNoteDimensionProps>
>(true)

export type FabricationNoteDimensionPropsInput = z.input<
  typeof fabricationNoteDimensionProps
>
