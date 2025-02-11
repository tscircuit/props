import { resistance } from "circuit-json"
import {
  type CommonComponentProps,
  commonComponentProps,
  lrPins,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export type PotentiometerPinVariant = "two_pin" | "three_pin"

export interface PotentiometerProps extends CommonComponentProps {
  maxResistance: number | string
  pinVariant?: PotentiometerPinVariant
}

export const potentiometerProps = commonComponentProps.extend({
  maxResistance: resistance,
  pinVariant: z.enum(["two_pin", "three_pin"]).optional(),
})

type InferredPotentiometerProps = z.input<typeof potentiometerProps>
expectTypesMatch<PotentiometerProps, InferredPotentiometerProps>(true)
