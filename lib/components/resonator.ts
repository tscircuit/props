import { frequency, capacitance } from "circuit-json"
import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface ResonatorProps extends CommonComponentProps {
  frequency: number | string
  loadCapacitance: number | string
  pinVariant: "3pin"
}

export const resonatorProps = commonComponentProps.extend({
  frequency: frequency,
  loadCapacitance: capacitance,
  pinVariant: z.literal("3pin"),
})

type InferredResonatorProps = z.input<typeof resonatorProps>
expectTypesMatch<ResonatorProps, InferredResonatorProps>(true)
