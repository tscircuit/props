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

export type SolderPasteProps = RectSolderPasteProps | CircleSolderPasteProps

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

export const solderPasteProps = z.union([
  circleSolderPasteProps,
  rectSolderPasteProps,
])

export type InferredSolderPasteProps = z.input<typeof solderPasteProps>
expectTypesMatch<InferredSolderPasteProps, SolderPasteProps>(true)
