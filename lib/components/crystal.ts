import { frequency, capacitance } from "circuit-json"
import {
  type CommonComponentProps,
  commonComponentProps,
  lrPins,
} from "lib/common/layout"
import type { Connections } from "lib/utility-types/connections-and-selectors"
import { createConnectionsProp } from "lib/common/connectionsProp"
import {
  schematicOrientation,
  type SchematicOrientation,
} from "lib/common/schematicOrientation"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export type PinVariant = "two_pin" | "four_pin"

export const crystalPins = lrPins
export type CrystalPinLabels = (typeof crystalPins)[number]

export interface CrystalProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  frequency: number | string
  loadCapacitance: number | string
  manufacturerPartNumber?: string
  mpn?: string
  pinVariant?: PinVariant
  schOrientation?: SchematicOrientation
  connections?: Connections<CrystalPinLabels>
}

export const crystalProps = commonComponentProps.extend({
  frequency: frequency,
  loadCapacitance: capacitance,
  manufacturerPartNumber: z.string().optional(),
  mpn: z.string().optional(),
  pinVariant: z.enum(["two_pin", "four_pin"]).optional(),
  schOrientation: schematicOrientation.optional(),
  connections: createConnectionsProp(crystalPins).optional(),
})

type InferredCrystalProps = z.input<typeof crystalProps>
expectTypesMatch<CrystalProps, InferredCrystalProps>(true)
