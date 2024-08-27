import { z } from "zod"
import { commonComponentProps, distanceOrMultiplier } from "../types/common"
import { distance } from "@tscircuit/soup"

const explicitPinSideDefinition = z.object({
  pins: z.array(z.number()),
  direction: z.union([
    z.literal("top-to-bottom"),
    z.literal("left-to-right"),
    z.literal("bottom-to-top"),
    z.literal("right-to-left"),
  ]),
})

const schematicPortArrangement = z
  .object({
    leftSize: z.number().optional().describe("@deprecated, use leftPinCount"),
    topSize: z.number().optional().describe("@deprecated, use topPinCount"),
    rightSize: z.number().optional().describe("@deprecated, use rightPinCount"),
    bottomSize: z
      .number()
      .optional()
      .describe("@deprecated, use bottomPinCount"),
  })
  .or(
    z.object({
      leftPinCount: z.number().optional(),
      rightPinCount: z.number().optional(),
      topPinCount: z.number().optional(),
      bottomPinCount: z.number().optional(),
    }),
  )
  .or(
    z.object({
      leftSide: explicitPinSideDefinition.optional(),
      rightSide: explicitPinSideDefinition.optional(),
      topSide: explicitPinSideDefinition.optional(),
      bottomSide: explicitPinSideDefinition.optional(),
    }),
  )

export const chipProps = commonComponentProps.extend({
  manufacturerPartNumber: z.string().optional(),
  pinLabels: z.record(z.number().or(z.string()), z.string()).optional(),

  schPortArrangement: schematicPortArrangement.optional(),
  schPinStyle: z
    .record(
      z.object({
        leftMargin: distance.optional(),
        rightMargin: distance.optional(),
        topMargin: distance.optional(),
        bottomMargin: distance.optional(),
      }),
    )
    .optional(),
  schPinSpacing: distanceOrMultiplier
    .or(z.literal("auto"))
    .optional()
    .default("auto"),
  schWidth: distance.or(z.literal("auto")).optional().default("auto"),
  schHeight: distance.or(z.literal("auto")).optional().default("auto"),
})
/**
 * @deprecated Use ChipProps instead.
 */
export const bugProps = chipProps
export type ChipProps = z.input<typeof chipProps>
import { z } from "zod"
import { commonLayoutProps } from "../types/common"
import { distance, layer_ref } from "@tscircuit/soup"

export const viaProps = commonLayoutProps.extend({
  fromLayer: layer_ref,
  toLayer: layer_ref,
  holeDiameter: distance,
  outerDiameter: distance,
})
export type ViaProps = z.input<typeof viaProps>
import { z } from "zod"
import { distance, point } from "@tscircuit/soup"

export const schematicBoxProps = z.object({
  schX: distance,
  schY: distance,
  width: distance,
  height: distance,
})
export type SchematicBoxProps = z.input<typeof schematicBoxProps>

export const schematicTextProps = z.object({
  schX: distance,
  schY: distance,
  text: z.string(),
})
export type SchematicTextProps = z.input<typeof schematicTextProps>

export const schematicLineProps = z.object({
  x1: distance,
  y1: distance,
  x2: distance,
  y2: distance,
})
export type SchematicLineProps = z.input<typeof schematicLineProps>

export const schematicPathProps = z.object({
  points: z.array(point),
  isFilled: z.boolean().optional().default(false),
  fillColor: z.enum(["red", "blue"]).optional(),
})
export type SchematicPathProps = z.input<typeof schematicPathProps>
import { z } from "zod"
import { commonLayoutProps } from "../types/common"
import type { LayoutBuilder } from "@tscircuit/layout"

export const groupProps = commonLayoutProps.extend({
  name: z.string().optional(),
  layout: z.custom<LayoutBuilder>((v) => true).optional(),
  children: z.any().optional(),
  routingDisabled: z.boolean().optional(),
})
export type GroupProps = z.input<typeof groupProps>
