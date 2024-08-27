import { z } from "zod"

export const portHints = z.array(z.string().or(z.number()))
export type PortHints = (string | number)[]

// This line performs a compile-time type check
const _typeCheck: z.infer<typeof portHints> extends PortHints ? true : false =
  true
