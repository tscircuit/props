import { frequency, capacitance } from "circuit-json"
import {
  type CommonComponentProps,
  commonComponentProps,
  lrPins,   
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import type { z } from "zod"

export interface CrystalProps extends CommonComponentProps {
  frequency: number | string,
  loadCapacitance: number | string
}

export const crystalProps = commonComponentProps.extend({
    frequency: frequency,
    loadCapacitance: capacitance,
})
export const crystalPins = lrPins

type InferredCrystalProps = z.input<typeof crystalProps>
expectTypesMatch<CrystalProps, InferredCrystalProps>(true)
