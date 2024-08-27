import { z } from "zod"

export const explicitPinSideDefinition = z.object({
  pins: z.array(z.number()),
  direction: z.union([
    z.literal("top-to-bottom"),
    z.literal("left-to-right"),
    z.literal("bottom-to-top"),
    z.literal("right-to-left"),
  ]),
})

export const schematicPortArrangement = z
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
