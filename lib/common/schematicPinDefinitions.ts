import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

/**
 * @deprecated Use SchematicPortArrangementWithPinCounts instead.
 */
export interface SchematicPortArrangementWithSizes {
  leftSize?: number
  topSize?: number
  rightSize?: number
  bottomSize?: number
}

/**
 * Specifies the number of pins on each side of the schematic box component.
 */
export interface SchematicPortArrangementWithPinCounts {
  leftPinCount?: number
  topPinCount?: number
  rightPinCount?: number
  bottomPinCount?: number
}

export interface PinSideDefinition {
  pins: number[]
  direction:
    | "top-to-bottom"
    | "left-to-right"
    | "bottom-to-top"
    | "right-to-left"
}

export interface SchematicPortArrangementWithSides {
  leftSide?: PinSideDefinition
  topSide?: PinSideDefinition
  rightSide?: PinSideDefinition
  bottomSide?: PinSideDefinition
}

export type SchematicPortArrangement =
  | SchematicPortArrangementWithSizes
  | SchematicPortArrangementWithSides
  | SchematicPortArrangementWithPinCounts

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

expectTypesMatch<
  SchematicPortArrangement,
  z.input<typeof schematicPortArrangement>
>(true)
