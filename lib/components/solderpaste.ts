import { pcbLayoutProps, type PcbLayoutProps } from "lib/common/layout"
import { distance, type Distance } from "lib/common/distance"
import { point, type Point } from "lib/common/point"
import { z } from "zod"
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

/**
 * Independent stencil outline, in footprint-local mm (+X right, +Y top).
 * Points receive pcbX/pcbY/pcbRotation and parent placement. Boundaries are
 * implicitly closed; holes describe unprinted islands inside the aperture.
 */
export interface PolygonSolderPasteProps extends PcbLayoutProps {
  shape: "polygon"
  points: Point[]
  holes?: Point[][]
}

export type SolderPasteProps =
  | RectSolderPasteProps
  | CircleSolderPasteProps
  | PolygonSolderPasteProps

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

export const polygonSolderPasteProps = pcbLayoutProps.extend({
  shape: z.literal("polygon"),
  points: z.array(point).min(3),
  holes: z.array(z.array(point).min(3)).optional(),
})
type InferredPolygonSolderPasteProps = z.input<typeof polygonSolderPasteProps>
expectTypesMatch<InferredPolygonSolderPasteProps, PolygonSolderPasteProps>(true)

export const solderPasteProps = z.union([
  circleSolderPasteProps,
  rectSolderPasteProps,
  polygonSolderPasteProps,
])

export type InferredSolderPasteProps = z.input<typeof solderPasteProps>
expectTypesMatch<InferredSolderPasteProps, SolderPasteProps>(true)
