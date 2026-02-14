import { resistance } from "circuit-json"
import { createConnectionsProp } from "lib/common/connectionsProp"
import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import type { Connections } from "lib/utility-types/connections-and-selectors"
import { z } from "zod"

export type PotentiometerPinVariant = "two_pin" | "three_pin"
export const potentiometerPinLabels = ["pin1", "pin2", "pin3"] as const
export type PotentiometerPinLabels = (typeof potentiometerPinLabels)[number]

export interface PotentiometerProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  maxResistance: number | string
  pinVariant?: PotentiometerPinVariant
  connections?: Connections<PotentiometerPinLabels>
}

export const potentiometerProps = commonComponentProps.extend({
  maxResistance: resistance,
  pinVariant: z.enum(["two_pin", "three_pin"]).optional(),
  connections: createConnectionsProp(potentiometerPinLabels).optional(),
})

type InferredPotentiometerProps = z.input<typeof potentiometerProps>
expectTypesMatch<PotentiometerProps, InferredPotentiometerProps>(true)
