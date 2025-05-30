import { distance } from "circuit-json"
import { z } from "zod"
import { nine_point_anchor } from "lib/common/nine_point_anchor"

const schematicBoxPropsType = z
  .union([
    z.object({
      schX: distance,
      schY: distance,
      padding: distance.optional(),
      title: z.string().optional(),
      titlePosition: nine_point_anchor.default("top_left"),
      titleColor: z.string().optional(),
      titleFontSize: distance.optional(),
      titleInside: z.boolean().default(false),
      overlay: z.array(z.string()).optional(),
      strokeStyle: z.enum(["solid", "dashed"]).default("solid"),
      paddingLeft: distance.optional(),
      paddingRight: distance.optional(),
      paddingTop: distance.optional(),
      paddingBottom: distance.optional(),
    }),
    z.object({
      schX: distance,
      schY: distance,
      width: distance,
      height: distance,
      padding: distance.optional(),
      title: z.string().optional(),
      titlePosition: nine_point_anchor.default("top_left"),
      titleColor: z.string().optional(),
      titleFontSize: distance.optional(),
      titleInside: z.boolean().default(false),
      strokeStyle: z.enum(["solid", "dashed"]).default("solid"),
      paddingLeft: distance.optional(),
      paddingRight: distance.optional(),
      paddingTop: distance.optional(),
      paddingBottom: distance.optional(),
    }),
  ])
  .describe("SchematicBoxProps")
export const schematicBoxProps = schematicBoxPropsType
export type SchematicBoxProps = z.input<typeof schematicBoxProps>
