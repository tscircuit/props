import { z } from "zod"
export const symbolCircleProps = z.object({
  cx: z.number(), cy: z.number(), r: z.number(),
  strokeWidth: z.number().optional(),
  filled: z.boolean().optional(),
})
export type SymbolCircleProps = z.infer<typeof symbolCircleProps>
