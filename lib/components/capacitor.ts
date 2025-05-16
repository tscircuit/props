import { capacitance, voltage } from "circuit-json"
import { createConnectionsProp } from "lib/common/connectionsProp"
import {
  type CommonComponentProps,
  commonComponentProps,
  lrPolarPins,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import type { Connections } from "lib/utility-types/connections-and-selectors"
import { z } from "zod"

export const capacitorPinLabels = [
  "pin1",
  "pin2",
  "pos",
  "neg",
  "anode",
  "cathode",
] as const
export type CapacitorPinLabels = (typeof capacitorPinLabels)[number]

export interface CapacitorProps extends CommonComponentProps {
  capacitance: number | string
  maxVoltageRating?: number | string
  schShowRatings?: boolean
  polarized?: boolean
  decouplingFor?: string
  decouplingTo?: string
  bypassFor?: string
  bypassTo?: string
  maxDecouplingTraceLength?: number
  connections?: Connections<CapacitorPinLabels>
  schSmall?: boolean
}

export const capacitorProps = commonComponentProps.extend({
  capacitance,
  maxVoltageRating: voltage.optional(),
  schShowRatings: z.boolean().optional().default(false),
  polarized: z.boolean().optional().default(false),
  decouplingFor: z.string().optional(),
  decouplingTo: z.string().optional(),
  bypassFor: z.string().optional(),
  bypassTo: z.string().optional(),
  maxDecouplingTraceLength: z.number().optional(),
  connections: createConnectionsProp(capacitorPinLabels).optional(),
  schSmall: z.boolean().optional(),
})
export const capacitorPins = lrPolarPins

expectTypesMatch<CapacitorProps, z.input<typeof capacitorProps>>(true)
