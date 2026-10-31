import { type Distance, distance } from "lib/common/distance"
import { type PcbLayoutProps, pcbLayoutProps } from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface CircleHoleProps extends PcbLayoutProps {
  name?: string
  shape?: "circle"
  diameter?: Distance
  holeDiameter?: Distance
  radius?: Distance
  solderMaskMargin?: Distance
  coveredWithSolderMask?: boolean
}

export interface PillHoleProps extends PcbLayoutProps {
  name?: string
  shape: "pill"
  width: Distance
  height: Distance
  solderMaskMargin?: Distance
  coveredWithSolderMask?: boolean
}

export interface OvalHoleProps extends PcbLayoutProps {
  name?: string
  shape: "oval"
  width: Distance
  height: Distance
  solderMaskMargin?: Distance
  coveredWithSolderMask?: boolean
}

export interface RectHoleProps extends PcbLayoutProps {
  name?: string
  shape: "rect"
  width: Distance
  height: Distance
  solderMaskMargin?: Distance
  coveredWithSolderMask?: boolean
}

export type HoleProps =
  | CircleHoleProps
  | PillHoleProps
  | OvalHoleProps
  | RectHoleProps

const circleHoleProps = pcbLayoutProps
  .extend({
    name: z.string().optional(),
    shape: z.literal("circle").optional(),
    diameter: distance.optional(),
    holeDiameter: distance.optional(),
    radius: distance.optional(),
    solderMaskMargin: distance.optional(),
    coveredWithSolderMask: z.boolean().optional(),
  })
  .refine(
    (d) =>
      d.diameter !== undefined ||
      d.holeDiameter !== undefined ||
      d.radius !== undefined,
    {
      message: "Circle hole requires diameter, holeDiameter, or radius",
    },
  )
  .transform((d) => {
    const diameter = d.diameter ?? d.holeDiameter ?? 2 * d.radius!
    const radius = d.radius ?? diameter / 2
    return {
      ...d,
      diameter,
      radius,
    }
  })

const pillHoleProps = pcbLayoutProps.extend({
  name: z.string().optional(),
  shape: z.literal("pill"),
  width: distance,
  height: distance,
  solderMaskMargin: distance.optional(),
  coveredWithSolderMask: z.boolean().optional(),
})

const ovalHoleProps = pcbLayoutProps.extend({
  name: z.string().optional(),
  shape: z.literal("oval"),
  width: distance,
  height: distance,
  solderMaskMargin: distance.optional(),
  coveredWithSolderMask: z.boolean().optional(),
})

const rectHoleProps = pcbLayoutProps.extend({
  name: z.string().optional(),
  shape: z.literal("rect"),
  width: distance,
  height: distance,
  solderMaskMargin: distance.optional(),
  coveredWithSolderMask: z.boolean().optional(),
})

export const holeProps = z.union([
  circleHoleProps,
  pillHoleProps,
  ovalHoleProps,
  rectHoleProps,
])

export type InferredHoleProps = z.input<typeof holeProps>

expectTypesMatch<HoleProps, InferredHoleProps>(true)
