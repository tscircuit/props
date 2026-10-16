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
  /**
   * How the symbol's drawing is fitted into `width` / `height`, following CSS `object-fit`:
   * - "fill" (default): each axis is scaled separately to the given size, so the drawing can stretch; with only
   *   `width` (or only `height`) given, only that axis is scaled.
   * - "contain": one scale factor for both axes, the largest at which the drawing fits inside the given size
   *   (with only `width` or only `height` given, that dimension sets it); the drawing keeps its proportions and is
   *   centred.
   */
  objectFit?: "fill" | "contain"
  /**
   * The region of the symbol's own coordinates (mm, y up) that is fitted into `width` / `height`, like SVG's
   * `viewBox` (`x`, `y` is the region's minimum corner). Without it, the region is the measured bounds of the
   * symbol's primitives and ports.
   */
  viewbox?: SymbolViewbox
  /**
   * Which measured bounds are fitted into `width` / `height` when no `viewbox` is given:
   * - "shape_and_port_bounds" (default): the drawing and the ports, so port stubs count towards the size;
   * - "shape_bounds": the drawing only, so the drawing itself comes out at the size asked for.
   * Giving both `viewbox` and `viewboxPreset` is an error.
   */
  viewboxPreset?: "shape_bounds" | "shape_and_port_bounds"
  name?: string
}

export interface SymbolViewbox {
  x: string | number
  y: string | number
  width: string | number
  height: string | number
}

export const symbolViewbox = z
  .object({
    x: distance,
    y: distance,
    width: distance,
    height: distance,
  })
  .refine((v) => v.width > 0 && v.height > 0, {
    message: "viewbox width and height must be greater than 0",
  })

export const symbolProps = z
  .object({
    originalFacingDirection: z
      .enum(["up", "down", "left", "right"])
      .default("right")
      .optional(),
    width: distance.optional(),
    height: distance.optional(),
    objectFit: z.enum(["fill", "contain"]).optional(),
    viewbox: symbolViewbox.optional(),
    viewboxPreset: z.enum(["shape_bounds", "shape_and_port_bounds"]).optional(),
    name: z.string().optional(),
  })
  .refine((p) => !(p.viewbox && p.viewboxPreset), {
    message: "give a symbol viewbox or a viewboxPreset, not both",
  })

export type SymbolPropsInput = z.input<typeof symbolProps>
type InferredSymbolProps = z.input<typeof symbolProps>
expectTypesMatch<InferredSymbolProps, SymbolProps>(true)
