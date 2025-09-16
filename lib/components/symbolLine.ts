import { z } from "zod"

export const symbolLineProps = z.object({
  x1: z.number(), y1: z.number(), x2: z.number(), y2: z.number(),
  strokeWidth: z.number().optional(),
})
export type SymbolLineProps = z.infer<typeof symbolLineProps>
