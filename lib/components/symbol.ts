import { distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface SymbolProps {
  /**
   * The facing direction that the symbol is designed for. If you set this to "right",
   * then it means the children were intended to represent the symbol facing right.
   * Generally, you shouldn't set this except where it can help prevent confusion
   * because you have a complex symbol. Default is "right" and this is most intuitive.
   */
  originalFacingDirection?: "up" | "down" | "left" | "right"
  width?: string | number
  height?: string | number
  /** Resize independently by default; contain uses one scale to fit the requested dimensions. */
  fit?: "fill" | "contain"
  /**
   * Source sizing rectangle in symbol-local coordinates (mm, +X right, +Y up).
   * With width/height, maps this rectangle to the symbol position; all artwork
   * and ports use the same transform. Omitted uses automatic bounds including ports.
   * Width and height must be positive. No aliases; no change to existing defaults.
   */
  viewbox?: {
    x: number | string
    y: number | string
    width: number | string
    height: number | string
  }
  name?: string
}

export const symbolProps = z.object({
  originalFacingDirection: z
    .enum(["up", "down", "left", "right"])
    .default("right")
    .optional(),
  width: distance.optional(),
  height: distance.optional(),
  fit: z.enum(["fill", "contain"]).optional(),
  viewbox: z
    .object({
      x: distance,
      y: distance,
      width: distance.pipe(z.number().positive()),
      height: distance.pipe(z.number().positive()),
    })
    .optional(),
  name: z.string().optional(),
})

export type SymbolPropsInput = z.input<typeof symbolProps>
type InferredSymbolProps = z.input<typeof symbolProps>
expectTypesMatch<InferredSymbolProps, SymbolProps>(true)
