import { pcbLayoutProps, type PcbLayoutProps } from "lib/common/layout"
import { distance, type Distance } from "lib/common/distance"
import { boolean, string, z } from "zod"
import { expectTypesMatch } from "lib/typecheck"

export interface RectSolderPasteProps
  extends Omit<PcbLayoutProps, "pcbRotation"> {
  shape: "rect"
  width: Distance
  height: Distance
}

export interface CircleSolderPasteProps
  extends Omit<PcbLayoutProps, "pcbRotation"> {
  shape: "circle"
  radius: Distance
}
export interface pillSolderPasteProps
  extends Omit<PcbLayoutProps, "pcbRotation"> {
  shape: "pill"
  width: Distance
  height: Distance
  radius: Distance
}
export interface RotatedRectSolderPasteProps
  extends Omit<PcbLayoutProps, "pcbRotation"> {
  shape: "rotated_rect"
  width: Distance
  height: Distance
  ccwRotation: number
}
export type SolderPasteProps =
  | RectSolderPasteProps
  | CircleSolderPasteProps
  | pillSolderPasteProps
  | RotatedRectSolderPasteProps

// zod

export const rectSolderPasteProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    shape: z.literal("rect"),
    width: distance,
    height: distance,
  })
type InferredRectSolderPasteProps = z.input<typeof rectSolderPasteProps>
expectTypesMatch<InferredRectSolderPasteProps, RectSolderPasteProps>(true)

export const circleSolderPasteProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    shape: z.literal("circle"),
    radius: distance,
  })
type InferredCircleSolderPasteProps = z.input<typeof circleSolderPasteProps>
expectTypesMatch<InferredCircleSolderPasteProps, CircleSolderPasteProps>(true)
export const pillSolderPasteProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    shape: z.literal("pill"),
    width: distance,
    height: distance,
    radius: distance,
  })
type InferredPillSolderPasteProps = z.input<typeof pillSolderPasteProps>
expectTypesMatch<InferredPillSolderPasteProps, pillSolderPasteProps>(true)

export const rotatedRectSolderPasteProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    shape: z.literal("rotated_rect"),
    width: distance,
    height: distance,
    ccwRotation: z.number(),
  })
type InferredRotatedRectSolderPasteProps = z.input<
  typeof rotatedRectSolderPasteProps
>
expectTypesMatch<
  InferredRotatedRectSolderPasteProps,
  RotatedRectSolderPasteProps
>(true)

export const solderPasteProps = z.union([
  circleSolderPasteProps,
  rectSolderPasteProps,
  rotatedRectSolderPasteProps,
  pillSolderPasteProps,
])

export type InferredSolderPasteProps = z.input<typeof solderPasteProps>
expectTypesMatch<InferredSolderPasteProps, SolderPasteProps>(true)
