import { capacitance, distance, frequency } from "circuit-json"
import { createConnectionsProp } from "lib/common/connectionsProp"
import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import {
  type SchematicOrientation,
  schematicOrientation,
} from "lib/common/schematicOrientation"
import { expectTypesMatch } from "lib/typecheck"
import type { Connections } from "lib/utility-types/connections-and-selectors"
import { z } from "zod"

export type PinVariant = "two_pin" | "four_pin"

export const crystalPins = [
  "pin1",
  "left",
  "pin2",
  "right",
  "pin3",
  "pin4",
] as const
export type CrystalPinLabels = (typeof crystalPins)[number]

export interface CrystalProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  frequency: number | string
  loadCapacitance: number | string
  /** Maximum allowed PCB trace length between the crystal and its connected component */
  maxTraceLength?: number | string
  manufacturerPartNumber?: string
  mpn?: string
  pinVariant?: PinVariant
  schOrientation?: SchematicOrientation
  connections?: Connections<CrystalPinLabels>
}

export const crystalProps = commonComponentProps.extend({
  frequency: frequency,
  loadCapacitance: capacitance,
  maxTraceLength: distance.optional(),
  manufacturerPartNumber: z.string().optional(),
  mpn: z.string().optional(),
  pinVariant: z.enum(["two_pin", "four_pin"]).optional(),
  schOrientation: schematicOrientation.optional(),
  connections: createConnectionsProp(crystalPins).optional(),
})

type InferredCrystalProps = z.input<typeof crystalProps>
expectTypesMatch<CrystalProps, InferredCrystalProps>(true)
