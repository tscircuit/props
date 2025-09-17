import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { symbolLineProps } from "./symbolLine"
import { symbolRectProps } from "./symbolRect"
import { symbolCircleProps } from "./symbolCircle"
import { symbolArcProps } from "./symbolArc"
import { symbolTextProps } from "./symbolText"

// Child prop types
export type SymbolLineProps = z.infer<typeof symbolLineProps>
export type SymbolRectProps = z.infer<typeof symbolRectProps>
export type SymbolCircleProps = z.infer<typeof symbolCircleProps>
export type SymbolArcProps = z.infer<typeof symbolArcProps>
export type SymbolTextProps = z.infer<typeof symbolTextProps>

// Discriminated union for children (TS view)
export type SymbolChild =
  | ({ type: "line" } & SymbolLineProps)
  | ({ type: "rect" } & SymbolRectProps)
  | ({ type: "circle" } & SymbolCircleProps)
  | ({ type: "arc" } & SymbolArcProps)
  | ({ type: "text" } & SymbolTextProps)

// Zod schema for children (keep existing transform-based logic)
const symbolChildSchema = z.union([
  symbolLineProps.transform((p) => ({ type: "line" as const, ...p })),
  symbolRectProps.transform((p) => ({ type: "rect" as const, ...p })),
  symbolCircleProps.transform((p) => ({ type: "circle" as const, ...p })),
  symbolArcProps.transform((p) => ({ type: "arc" as const, ...p })),
  symbolTextProps.transform((p) => ({ type: "text" as const, ...p })),
])

// Main props schema
export const symbolProps = z.object({
  /**
   * The facing direction that the symbol is designed for. If you set this to "right",
   * then it means the children were intended to represent the symbol facing right.
   * Generally, you shouldn't set this except where it can help prevent confusion
   * because you have a complex symbol. Default is "right" and this is most intuitive.
   */
  originalFacingDirection: z.enum(["up", "down", "left", "right"]).default("right").optional(),
  width: z.number().optional(),
  height: z.number().optional(),
  /** Children primitives that make up this symbol (line, rect, circle, arc, text). */
  children: z.array(symbolChildSchema).optional(),
})

export type SymbolPropsInput = z.input<typeof symbolProps>
export type SymbolProps = z.output<typeof symbolProps>

type InferredSymbolProps = z.infer<typeof symbolProps>
expectTypesMatch<InferredSymbolProps, SymbolProps>(true)
