import { brep_shape, type VisibleLayer, visible_layer } from "circuit-json"
import { type Distance, distance } from "lib/common/distance"
import { pcbLayoutProps } from "lib/common/layout"
import { url } from "lib/common/url"
import { z } from "zod"

type SilkscreenGraphicLayoutProps = {
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

type BRepShapeInput = z.input<typeof brep_shape>

type SilkscreenGraphicSourceProps = SilkscreenGraphicLayoutProps & {
  /**
   * URL or static-file import for the source image. tscircuit/core converts the
   * image into the pcb_silkscreen_graphic BRep in circuit-json.
   */
  imageUrl: string
  /** Width of the rendered silkscreen graphic on the PCB. */
  width: Distance
  /** Height of the rendered silkscreen graphic on the PCB. */
  height: Distance
  brepShape?: never
}

type SilkscreenGraphicBrepProps = SilkscreenGraphicLayoutProps & {
  /** Precomputed BRep shape to emit directly into pcb_silkscreen_graphic. */
  brepShape: BRepShapeInput
  imageUrl?: never
  width?: never
  height?: never
}

const silkscreenGraphicBaseProps = pcbLayoutProps
  .omit({ layer: true, pcbStyle: true, pcbSx: true })
  .extend({
    layer: visible_layer.optional(),
  })

export const silkscreenGraphicProps = z.union([
  silkscreenGraphicBaseProps.extend({
    imageUrl: url,
    width: distance,
    height: distance,
    brepShape: z.never().optional(),
  }),
  silkscreenGraphicBaseProps.extend({
    brepShape: brep_shape,
    imageUrl: z.never().optional(),
    width: z.never().optional(),
    height: z.never().optional(),
  }),
])

export type SilkscreenGraphicProps = z.input<typeof silkscreenGraphicProps>
