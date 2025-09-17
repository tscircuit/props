import { z } from "zod"
export const symbolTextProps = z.object({
  x: z.number(),
  y: z.number(),
  text: z.string(),
  fontSize: z.number().optional(),
  rotateDeg: z.number().optional(),
})
export type SymbolTextProps = z.infer<typeof symbolTextProps>
