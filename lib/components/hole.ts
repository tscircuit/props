import { z } from "zod"
import { distance, type Distance } from "lib/common/distance"
import { pcbLayoutProps, type PcbLayoutProps } from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"

export interface CircleHoleProps extends PcbLayoutProps {
  name?: string
  shape?: "circle"
  diameter?: Distance
  /**
   * Alias for `diameter` matching `<platedhole>`/`<via>` naming.
   * Supplying both `diameter` and `holeDiameter` with different values is an
   * error; when both are absent `radius` is used.
   */
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
  .superRefine((d, ctx) => {
    if (
      d.diameter != null &&
      d.holeDiameter != null &&
      d.diameter !== d.holeDiameter
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          '"diameter" and its alias "holeDiameter" disagree; supply only one',
      })
    }
    if (d.diameter == null && d.holeDiameter == null && d.radius == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'circle <hole> requires "diameter" (alias: "holeDiameter") or "radius"',
      })
    }
  })
  .transform((d) => {
    const diameter = d.diameter ?? d.holeDiameter ?? 2 * d.radius!
    return {
      ...d,
      diameter,
      radius: d.radius ?? diameter / 2,
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
