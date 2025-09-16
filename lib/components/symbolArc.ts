import { z } from "zod"
export const symbolArcProps = z.object({
  cx: z.number(), cy: z.number(), r: z.number(),
  // degrees; 0° = +X axis; CCW positive
  startDeg: z.number(), endDeg: z.number(),
  strokeWidth: z.number().optional(),
})
export type SymbolArcProps = z.infer<typeof symbolArcProps>
