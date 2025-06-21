import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export const schematicOrientation = z
  .enum([
    "vertical",
    "horizontal",
    "pos_top",
    "pos_bottom",
    "pos_left",
    "pos_right",
    "neg_top",
    "neg_bottom",
    "neg_left",
    "neg_right",
  ])
  .describe(
    "horizontal means pins go 1->2 rightward and vertical means pins go 1->2 downward (generally, positive on top)",
  )

export type SchematicOrientation =
  | "vertical"
  | "horizontal"
  | "pos_top"
  | "pos_bottom"
  | "pos_left"
  | "pos_right"
  | "neg_top"
  | "neg_bottom"
  | "neg_left"
  | "neg_right"

expectTypesMatch<SchematicOrientation, z.infer<typeof schematicOrientation>>(
  true,
)
