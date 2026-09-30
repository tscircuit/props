import { asset, brep_shape } from "circuit-json"
import { z } from "zod"

const silkscreenLayer = z.enum(["top", "bottom"])

/**
 * Advanced escape hatch for inserting already-computed silkscreen geometry.
 * Prefer `SilkscreenGraphicProps` when the graphic should be derived from an
 * SVG or PNG image inside tscircuit.
 */
export const pcbSilkscreenGraphicProps = z.object({
  brepShape: brep_shape,
  imageAsset: asset.optional(),
  layer: silkscreenLayer,
})

export type PcbSilkscreenGraphicProps = z.input<
  typeof pcbSilkscreenGraphicProps
>
