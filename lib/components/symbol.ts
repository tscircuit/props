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
  /** CSS-style fill (default) and stretch resize axes independently; contain preserves proportions. */
  fit?: "fill" | "contain" | "stretch"
  /**
   * Source sizing bounds in the local symbol coordinate space (mm, +X right, +Y up).
   * With width/height, maps the bounds center to the symbol position; all artwork
   * and ports use the same transform. Omitted uses automatic bounds including ports.
   * maxX must exceed minX and maxY must exceed minY. Other shapes are rejected
   * with a diagnostic listing the required bounds. No aliases; existing defaults are unchanged.
   */
  viewbox?: {
    minX: number | string
    maxX: number | string
    minY: number | string
    maxY: number | string
  }
  name?: string
}

const symbolViewboxBounds = z
  .object({
    minX: distance,
    maxX: distance,
    minY: distance,
    maxY: distance,
  })
  .refine((bounds) => bounds.maxX > bounds.minX, {
    message: "viewbox maxX must exceed minX",
    path: ["maxX"],
  })
  .refine((bounds) => bounds.maxY > bounds.minY, {
    message: "viewbox maxY must exceed minY",
    path: ["maxY"],
  })

export const symbolProps = z.object({
  originalFacingDirection: z
    .enum(["up", "down", "left", "right"])
    .default("right")
    .optional(),
  width: distance.optional(),
  height: distance.optional(),
  fit: z.enum(["fill", "contain", "stretch"]).optional(),
  viewbox: z
    .custom<z.input<typeof symbolViewboxBounds>>(
      (bounds) =>
        typeof bounds === "object" &&
        bounds !== null &&
        "minX" in bounds &&
        "maxX" in bounds &&
        "minY" in bounds &&
        "maxY" in bounds,
      {
        message:
          "viewbox requires { minX, maxX, minY, maxY } bounds in the local symbol coordinate space.",
      },
    )
    .pipe(symbolViewboxBounds)
    .optional(),
  name: z.string().optional(),
})

export type SymbolPropsInput = z.input<typeof symbolProps>
type InferredSymbolProps = z.input<typeof symbolProps>
expectTypesMatch<InferredSymbolProps, SymbolProps>(true)
