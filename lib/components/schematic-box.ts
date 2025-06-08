import { distance, position } from "circuit-json"
import { z } from "zod"
import { nine_point_anchor } from "lib/common/nine_point_anchor"

export const schematicBoxProps = z
  .object({
    schX: distance,
    schY: distance,
    width: distance.optional(),
    height: distance.optional(),
    overlay: z.array(z.string()).optional(),

    padding: distance.optional(),
    paddingLeft: distance.optional(),
    paddingRight: distance.optional(),
    paddingTop: distance.optional(),
    paddingBottom: distance.optional(),

    title: z.string().optional(),
    titleAnchorPosition: z
      .object({
        x: z.number().default(0),
        y: z.number().default(0),
      })
      .optional(),
    titleAnchorAlignment: nine_point_anchor.default("center"),
    titleColor: z.string().optional(),
    titleFontSize: distance.optional(),
    titleInside: z.boolean().default(false),
    strokeStyle: z.enum(["solid", "dashed"]).default("solid"),
  })
  .refine(
    (elm) =>
      (elm.width !== undefined && elm.height !== undefined) ||
      (Array.isArray(elm.overlay) && elm.overlay.length > 0),
    {
      message:
        "Must provide either both `width` and `height`, or a non-empty `overlay` array.",
    },
  )
  .refine(
    (elm) =>
      !(
        elm.width !== undefined &&
        elm.height !== undefined &&
        Array.isArray(elm.overlay) &&
        elm.overlay.length > 0
      ),
    {
      message:
        "Cannot provide both `width`/`height` and `overlay` at the same time.",
    },
  )
export type SchematicBoxProps = z.input<typeof schematicBoxProps>
