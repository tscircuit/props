import { pcbLayoutProps, type PcbLayoutProps } from "lib/common/layout"
import { distance, type Distance } from "lib/common/distance"
import { z } from "zod"
import { point, type Point } from "lib/common/point"
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

/** An ellipse with full local-axis diameters, rotated by pcbRotation. */
export interface OvalSolderPasteProps extends PcbLayoutProps {
  shape: "oval"
  width: Distance
  height: Distance
}

/** Closed local contours in mm; holes remove paste from the opening. */
export interface PolygonSolderPasteProps extends PcbLayoutProps {
  shape: "polygon"
  points: Point[]
  holes?: Point[][]
}

export type SolderPasteProps =
  | RectSolderPasteProps
  | CircleSolderPasteProps
  | OvalSolderPasteProps
  | PolygonSolderPasteProps

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

export const ovalSolderPasteProps = rectSolderPasteProps.extend({
  shape: z.literal("oval"),
})
export const polygonSolderPasteProps = pcbLayoutProps.extend({
  shape: z.literal("polygon"),
  points: z.array(point).min(3),
  holes: z.array(z.array(point).min(3)).optional(),
})

export const solderPasteProps = z.union([
  circleSolderPasteProps,
  rectSolderPasteProps,
  ovalSolderPasteProps,
  polygonSolderPasteProps,
])

export type InferredSolderPasteProps = z.input<typeof solderPasteProps>
expectTypesMatch<InferredSolderPasteProps, SolderPasteProps>(true)
