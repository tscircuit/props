import { distance } from "circuit-json"
import { ninePointAnchor } from "lib/common/ninePointAnchor"
import {
  type SchematicPinArrangement,
  schematicPinArrangement,
} from "lib/common/schematicPinDefinitions"
import { type PinLabelsProp, pinLabelsProp } from "lib/components/chip"
import { expectTypesMatch } from "lib/typecheck"
import type { Distance } from "lib/common/distance"
import { z } from "zod"

export const schematicBoxProps = z
  .object({
    name: z.string().optional(),
    chipRef: z.string().optional(),
    pinLabels: pinLabelsProp.optional(),
    schPinArrangement: schematicPinArrangement.optional(),

    schX: distance.optional(),
    schY: distance.optional(),
    schSheetName: z.string().optional(),
    width: distance.optional(),
    height: distance.optional(),
    overlay: z.array(z.string()).optional(),

    padding: distance.optional(),
    paddingLeft: distance.optional(),
    paddingRight: distance.optional(),
    paddingTop: distance.optional(),
    paddingBottom: distance.optional(),

    title: z.string().optional(),
    titleAlignment: ninePointAnchor.default("top_left"),
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

export interface SchematicBoxProps {
  name?: string
  chipRef?: string
  pinLabels?: PinLabelsProp
  schPinArrangement?: SchematicPinArrangement
  schX?: Distance
  schY?: Distance
  schSheetName?: string
  width?: Distance
  height?: Distance
  overlay?: string[]
  padding?: Distance
  paddingLeft?: Distance
  paddingRight?: Distance
  paddingTop?: Distance
  paddingBottom?: Distance
  title?: string
  titleAlignment?: z.infer<typeof ninePointAnchor>
  titleColor?: string
  titleFontSize?: Distance
  titleInside?: boolean
  strokeStyle?: "solid" | "dashed"
}

export type InferredSchematicBoxProps = z.input<typeof schematicBoxProps>

expectTypesMatch<SchematicBoxProps, z.input<typeof schematicBoxProps>>(true)
