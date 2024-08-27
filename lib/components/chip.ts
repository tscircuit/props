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
