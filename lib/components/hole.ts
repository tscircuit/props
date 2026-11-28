import { z } from "zod"
import { distance, type Distance } from "lib/common/distance"
import { pcbLayoutProps, type PcbLayoutProps } from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"

export interface CircleHoleProps extends PcbLayoutProps {
  name?: string
  shape?: "circle"
  diameter?: Distance
  // Alias of diameter; normalized to diameter on parse. Errors if both are set and disagree.
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

const positiveDistance = distance.pipe(z.number().finite().positive())

const dimensionsMatch = (a: number, b: number) =>
  Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b))

const circleHoleProps = pcbLayoutProps
  .extend({
    name: z.string().optional(),
    shape: z.literal("circle").optional(),
    diameter: positiveDistance.optional(),
    holeDiameter: positiveDistance.optional(),
    radius: positiveDistance.optional(),
    solderMaskMargin: distance.optional(),
    coveredWithSolderMask: z.boolean().optional(),
  })
  .superRefine((d, ctx) => {
    if (
      d.diameter !== undefined &&
      d.holeDiameter !== undefined &&
      !dimensionsMatch(d.diameter, d.holeDiameter)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["holeDiameter"],
        message: "holeDiameter is an alias of diameter; they must match",
      })
    }

    const resolvedDiameter = d.diameter ?? d.holeDiameter

    if (resolvedDiameter === undefined && d.radius === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["diameter"],
        message: "Circle hole requires diameter, holeDiameter, or radius",
      })
      return
    }

    if (
      resolvedDiameter !== undefined &&
      d.radius !== undefined &&
      !dimensionsMatch(resolvedDiameter, 2 * d.radius)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["radius"],
        message: "radius must equal half of diameter",
      })
    }
  })
  .transform(({ holeDiameter, ...d }) => {
    const diameter = d.diameter ?? holeDiameter ?? 2 * d.radius!
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
  width: positiveDistance,
  height: positiveDistance,
  solderMaskMargin: distance.optional(),
  coveredWithSolderMask: z.boolean().optional(),
})

const ovalHoleProps = pcbLayoutProps.extend({
  name: z.string().optional(),
  shape: z.literal("oval"),
  width: positiveDistance,
  height: positiveDistance,
  solderMaskMargin: distance.optional(),
  coveredWithSolderMask: z.boolean().optional(),
})

const rectHoleProps = pcbLayoutProps.extend({
  name: z.string().optional(),
  shape: z.literal("rect"),
  width: positiveDistance,
  height: positiveDistance,
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
