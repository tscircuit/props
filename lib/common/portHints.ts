import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"

export const portHints = z.array(z.string().or(z.number()))
export type PortHints = (string | number)[]

expectTypesMatch<PortHints, z.infer<typeof portHints>>(true)
