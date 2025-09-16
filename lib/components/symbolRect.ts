import { z } from "zod"
export const symbolRectProps = z.object({
  x: z.number(), y: z.number(), width: z.number(), height: z.number(),
  rx: z.number().optional(), ry: z.number().optional(),
  strokeWidth: z.number().optional(),
  filled: z.boolean().optional(),
})
export type SymbolRectProps = z.infer<typeof symbolRectProps>
