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
}

export const symbolProps = z.object({
  originalFacingDirection: z
    .enum(["up", "down", "left", "right"])
    .default("right")
    .optional(),
})

export type SymbolPropsInput = z.input<typeof symbolProps>
type InferredSymbolProps = z.infer<typeof symbolProps>
expectTypesMatch<InferredSymbolProps, SymbolProps>(true)
