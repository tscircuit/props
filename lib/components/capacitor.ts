import { capacitance } from "circuit-json"
import {
  type CommonComponentProps,
  commonComponentProps,
  lrPolarPins,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface CapacitorProps extends CommonComponentProps {
  capacitance: number | string

  decouplingFor?: string
  decouplingTo?: string

  bypassFor?: string
  bypassTo?: string
}

export const capacitorProps = commonComponentProps.extend({
  capacitance,

  decouplingFor: z.string().optional(),
  decouplingTo: z.string().optional(),

  bypassFor: z.string().optional(),
  bypassTo: z.string().optional(),
})
export const capacitorPins = lrPolarPins

expectTypesMatch<CapacitorProps, z.input<typeof capacitorProps>>(true)
