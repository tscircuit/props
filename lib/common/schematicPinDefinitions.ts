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
  pins: Array<number | string>
  direction:
    | "top-to-bottom"
    | "left-to-right"
    | "bottom-to-top"
    | "right-to-left"
}

export type PinSideDefinitionInput = PinSideDefinition | Array<number | string>

export interface SchematicPortArrangementWithSides {
  leftSide?: PinSideDefinitionInput
  topSide?: PinSideDefinitionInput
  rightSide?: PinSideDefinitionInput
  bottomSide?: PinSideDefinitionInput
}

export interface SchematicPortArrangement
  extends SchematicPortArrangementWithSizes,
    SchematicPortArrangementWithSides,
    SchematicPortArrangementWithPinCounts {}

export type SchematicPinArrangement = SchematicPortArrangement
export type SchematicPinArrangementWithSizes = SchematicPortArrangementWithSizes
export type SchematicPinArrangementWithSides = SchematicPortArrangementWithSides
export type SchematicPinArrangementWithPinCounts =
  SchematicPortArrangementWithPinCounts

export const explicitPinSideDefinition = z.object({
  pins: z.array(z.union([z.number(), z.string()])),
  direction: z.union([
    z.literal("top-to-bottom"),
    z.literal("left-to-right"),
    z.literal("bottom-to-top"),
    z.literal("right-to-left"),
  ]),
})

const pinSideDefinitionInput = z.array(z.union([z.number(), z.string()]))

const pinSideDefinitionWithDefaultDirection = (
  direction: PinSideDefinition["direction"],
) =>
  z
    .union([explicitPinSideDefinition, pinSideDefinitionInput])
    .transform((value) =>
      Array.isArray(value)
        ? {
            pins: value,
            direction,
          }
        : value,
    )

/**
 * @deprecated Use schematicPinArrangement instead.
 */
export const schematicPortArrangement = z.object({
  leftSize: z.number().optional().describe("@deprecated, use leftPinCount"),
  topSize: z.number().optional().describe("@deprecated, use topPinCount"),
  rightSize: z.number().optional().describe("@deprecated, use rightPinCount"),
  bottomSize: z.number().optional().describe("@deprecated, use bottomPinCount"),
  leftPinCount: z.number().optional(),
  rightPinCount: z.number().optional(),
  topPinCount: z.number().optional(),
  bottomPinCount: z.number().optional(),
  leftSide: pinSideDefinitionWithDefaultDirection("top-to-bottom").optional(),
  rightSide: pinSideDefinitionWithDefaultDirection("top-to-bottom").optional(),
  topSide: pinSideDefinitionWithDefaultDirection("left-to-right").optional(),
  bottomSide: pinSideDefinitionWithDefaultDirection("left-to-right").optional(),
})

export const schematicPinArrangement = schematicPortArrangement

expectTypesMatch<
  SchematicPortArrangement,
  z.input<typeof schematicPortArrangement>
>(true)
