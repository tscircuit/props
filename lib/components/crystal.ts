import { frequency, capacitance } from "circuit-json"
import {
  type CommonComponentProps,
  commonComponentProps,
  lrPins,
} from "lib/common/layout"
import {
  schematicOrientation,
  type SchematicOrientation,
} from "lib/common/schematicOrientation"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export type PinVariant = "two_pin" | "four_pin"

export interface CrystalProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  frequency: number | string
  loadCapacitance: number | string
  pinVariant?: PinVariant
  schOrientation?: SchematicOrientation
}

export const crystalProps = commonComponentProps.extend({
  frequency: frequency,
  loadCapacitance: capacitance,
  pinVariant: z.enum(["two_pin", "four_pin"]).optional(),
  schOrientation: schematicOrientation.optional(),
})
export const crystalPins = lrPins
export type CrystalPinLabels = (typeof crystalPins)[number]

type InferredCrystalProps = z.input<typeof crystalProps>
expectTypesMatch<CrystalProps, InferredCrystalProps>(true)
