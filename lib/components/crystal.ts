import { capacitance, frequency } from "circuit-json"
import { createConnectionsProp } from "lib/common/connectionsProp"
import {
  type CommonComponentProps,
  commonComponentProps,
  lrPins,
} from "lib/common/layout"
import {
  type SchematicOrientation,
  schematicOrientation,
} from "lib/common/schematicOrientation"
import { expectTypesMatch } from "lib/typecheck"
import type { Connections } from "lib/utility-types/connections-and-selectors"
import { z } from "zod"

export type PinVariant = "two_pin" | "four_pin"

export const crystalPins = lrPins
export type CrystalPinLabels = (typeof crystalPins)[number]

export interface CrystalProps<PinLabel extends string = string>
  extends Omit<CommonComponentProps<PinLabel>, "name"> {
  name?: string
  frequency: number | string
  loadCapacitance: number | string
  manufacturerPartNumber?: string
  mpn?: string
  pinVariant?: PinVariant
  schOrientation?: SchematicOrientation
  connections?: Connections<CrystalPinLabels>
}

export const crystalProps = commonComponentProps.omit({ name: true }).extend({
  name: z.string().optional(),
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
