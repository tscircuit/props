import { type VisibleLayer, brep_shape, visible_layer } from "circuit-json"
import { type Distance, distance } from "lib/common/distance"
import { pcbLayoutProps } from "lib/common/layout"
import { url } from "lib/common/url"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface SilkscreenGraphicProps {
  /**
   * URL or static-file import for the source image. tscircuit/core converts the
   * image into the pcb_silkscreen_graphic BRep in circuit-json.
   */
  imageUrl?: string
  /**
   * Native geometry in the footprint-local PCB frame: points in mm, +X right,
   * +Y up, right-handed with +Z above the board. Placement and rotation apply
   * to every ring; width and height describe layout size without scaling it.
   * Provide exactly one of brepShape or imageUrl.
   */
  brepShape?: z.input<typeof brep_shape>
  /** Image width, or native geometry's layout width, on the PCB. */
  width: Distance
  /** Image height, or native geometry's layout height, on the PCB. */
  height: Distance
  /** PCB layer for the silkscreen graphic. */
  layer?: VisibleLayer
  pcbX?: string | number
  pcbY?: string | number
  pcbLeftEdgeX?: string | number
  pcbRightEdgeX?: string | number
  pcbTopEdgeY?: string | number
  pcbBottomEdgeY?: string | number
  pcbOffsetX?: string | number
  pcbOffsetY?: string | number
  pcbRotation?: string | number
  pcbPositionAnchor?: string
  pcbPositionMode?:
    | "relative_to_group_anchor"
    | "auto"
    | "relative_to_board_anchor"
    | "relative_to_component_anchor"
  shouldBeOnEdgeOfBoard?: boolean
  pcbMarginTop?: string | number
  pcbMarginRight?: string | number
  pcbMarginBottom?: string | number
  pcbMarginLeft?: string | number
  pcbMarginX?: string | number
  pcbMarginY?: string | number
  pcbRelative?: boolean
  relative?: boolean
}

export const silkscreenGraphicProps = pcbLayoutProps
  .omit({ layer: true, pcbStyle: true, pcbSx: true })
  .extend({
    imageUrl: url.optional(),
    brepShape: brep_shape.optional(),
    width: distance,
    height: distance,
    layer: visible_layer.optional(),
  })
  .refine(
    ({ imageUrl, brepShape }) =>
      (imageUrl !== undefined) !== (brepShape !== undefined),
    {
      message: "Provide exactly one of imageUrl or brepShape",
    },
  )

type InferredSilkscreenGraphicProps = z.input<typeof silkscreenGraphicProps>
expectTypesMatch<SilkscreenGraphicProps, InferredSilkscreenGraphicProps>(true)
