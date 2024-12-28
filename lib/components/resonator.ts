import { frequency, capacitance } from "circuit-json"
import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export type ResonatorPinVariant = "no_ground" | "ground_pin" | "two_ground_pins"

export interface ResonatorProps extends CommonComponentProps {
  frequency: number | string
  loadCapacitance: number | string
  pinVariant?: ResonatorPinVariant
}

export const resonatorProps = commonComponentProps.extend({
  frequency: frequency,
  loadCapacitance: capacitance,
  pinVariant: z.enum(["no_ground", "ground_pin", "two_ground_pins"]).optional(),
})

type InferredResonatorProps = z.input<typeof resonatorProps>
expectTypesMatch<ResonatorProps, InferredResonatorProps>(true)
