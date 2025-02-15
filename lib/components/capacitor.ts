import { capacitance, voltage } from "circuit-json"
import {
  type CommonComponentProps,
  commonComponentProps,
  lrPolarPins,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface CapacitorProps extends CommonComponentProps {
  capacitance: number | string
  maxVoltageRating?: number | string
  polarized?: boolean
  decouplingFor?: string
  decouplingTo?: string
  bypassFor?: string
  bypassTo?: string
  maxDecouplingTraceLength?: number
}

export const capacitorProps = commonComponentProps.extend({
  capacitance,
  maxVoltageRating: voltage.optional(),
  polarized: z.boolean().optional().default(false),
  decouplingFor: z.string().optional(),
  decouplingTo: z.string().optional(),
  bypassFor: z.string().optional(),
  bypassTo: z.string().optional(),
  maxDecouplingTraceLength: z.number().optional(),
})
export const capacitorPins = lrPolarPins

expectTypesMatch<CapacitorProps, z.input<typeof capacitorProps>>(true)
