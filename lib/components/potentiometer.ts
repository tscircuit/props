import { resistance } from "circuit-json"
import {
  type CommonComponentProps,
  commonComponentProps,
  lrPins,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface PotentiometerProps extends CommonComponentProps {
  resistance: number | string
  wiper?: number
}

export const potentiometerProps = commonComponentProps.extend({
  resistance,
  wiper: z.number().min(0).max(1).optional().default(0.5),
})
export const potentiometerPins = lrPins

type InferredPotentiometerProps = z.input<typeof potentiometerProps>
expectTypesMatch<PotentiometerProps, InferredPotentiometerProps>(true)
