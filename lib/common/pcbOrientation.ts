import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export const pcbOrientation = z
  .enum(["vertical", "horizontal"])
  .describe(
    "vertical means pins go 1->2 downward and horizontal means pins go 1->2 rightward",
  )

export type PcbOrientation = "vertical" | "horizontal"

expectTypesMatch<PcbOrientation, z.infer<typeof pcbOrientation>>(true)
