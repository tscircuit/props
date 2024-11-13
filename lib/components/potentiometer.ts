import { resistance } from "circuit-json"
import {
  type CommonComponentProps,
  commonComponentProps,
  lrPins,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import type { z } from "zod"

export interface PotentiometerProps extends CommonComponentProps {
  maxResistance: number | string
}

export const potentiometerProps = commonComponentProps.extend({
  maxResistance: resistance,
})
export const potentiometerPins = lrPins

type InferredPotentiometerProps = z.input<typeof potentiometerProps>
expectTypesMatch<PotentiometerProps, InferredPotentiometerProps>(true)
