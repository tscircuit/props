import { pcbLayoutProps, type PcbLayoutProps } from "lib/common/layout"
import { distance, type Distance } from "lib/common/distance"
import { z } from "zod"
import { pillShapeProps, type PillShapeProps } from "lib/common/commonShape"
import { expectTypesMatch } from "lib/typecheck"

export interface RectSolderPasteProps extends PcbLayoutProps {
  shape: "rect"
  width: Distance
  height: Distance
}

export interface CircleSolderPasteProps
  extends Omit<PcbLayoutProps, "pcbRotation"> {
  shape: "circle"
  radius: Distance
}

export interface PillSolderPasteProps extends PcbLayoutProps, PillShapeProps {
  /** Explicit corner radius; a capsule uses half the smaller dimension. */
  radius: Distance
}

export type SolderPasteProps =
  | RectSolderPasteProps
  | CircleSolderPasteProps
  | PillSolderPasteProps

// zod

export const rectSolderPasteProps = pcbLayoutProps.extend({
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
  .merge(pillShapeProps)
  .extend({
    radius: distance,
  })
type InferredPillSolderPasteProps = z.input<typeof pillSolderPasteProps>
expectTypesMatch<InferredPillSolderPasteProps, PillSolderPasteProps>(true)

export const solderPasteProps = z.union([
  circleSolderPasteProps,
  rectSolderPasteProps,
  pillSolderPasteProps,
])

export type InferredSolderPasteProps = z.input<typeof solderPasteProps>
expectTypesMatch<InferredSolderPasteProps, SolderPasteProps>(true)
