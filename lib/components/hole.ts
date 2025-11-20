import { z } from "zod"
import { distance, type Distance } from "lib/common/distance"
import { pcbLayoutProps, type PcbLayoutProps } from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"

export interface CircleHoleProps extends PcbLayoutProps {
  name?: string
  shape?: "circle"
  diameter?: Distance
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

export interface RectHoleProps extends PcbLayoutProps {
  name?: string
  shape: "rect"
  width: Distance
  height: Distance
  solderMaskMargin?: Distance
  coveredWithSolderMask?: boolean
}

export type HoleProps = CircleHoleProps | PillHoleProps | RectHoleProps

const circleHoleProps = pcbLayoutProps
  .extend({
    name: z.string().optional(),
    shape: z.literal("circle").optional(),
    diameter: distance.optional(),
    radius: distance.optional(),
    solderMaskMargin: distance.optional(),
    coveredWithSolderMask: z.boolean().optional(),
  })
  .transform((d) => ({
    ...d,
    diameter: d.diameter ?? 2 * d.radius!,
    radius: d.radius ?? d.diameter! / 2,
  }))

const pillHoleProps = pcbLayoutProps.extend({
  name: z.string().optional(),
  shape: z.literal("pill"),
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
  rectHoleProps,
])

export type InferredHoleProps = z.input<typeof holeProps>

expectTypesMatch<HoleProps, InferredHoleProps>(true)
