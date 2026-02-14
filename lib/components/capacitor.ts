import { capacitance, voltage } from "circuit-json"
import { createConnectionsProp } from "lib/common/connectionsProp"
import {
  type CommonComponentProps,
  commonComponentProps,
  lrPolarPins,
} from "lib/common/layout"
import {
  schematicSymbolSize,
  type SchematicSymbolSize,
} from "lib/common/schematicSize"
import {
  schematicOrientation,
  type SchematicOrientation,
} from "lib/common/schematicOrientation"
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

export interface CapacitorProps<PinLabel extends string = string>
  extends Omit<CommonComponentProps<PinLabel>, "name"> {
  name?: string
  capacitance: number | string
  maxVoltageRating?: number | string
  schShowRatings?: boolean
  polarized?: boolean
  decouplingFor?: string
  decouplingTo?: string
  bypassFor?: string
  bypassTo?: string
  maxDecouplingTraceLength?: number
  schOrientation?: SchematicOrientation
  schSize?: SchematicSymbolSize
  connections?: Connections<CapacitorPinLabels>
}

export const capacitorProps = commonComponentProps.omit({ name: true }).extend({
  capacitance,
  name: z.string().optional(),
  maxVoltageRating: voltage.optional(),
  schShowRatings: z.boolean().optional().default(false),
  polarized: z.boolean().optional().default(false),
  decouplingFor: z.string().optional(),
  decouplingTo: z.string().optional(),
  bypassFor: z.string().optional(),
  bypassTo: z.string().optional(),
  maxDecouplingTraceLength: z.number().optional(),
  schOrientation: schematicOrientation.optional(),
  schSize: schematicSymbolSize.optional(),
  connections: createConnectionsProp(capacitorPinLabels).optional(),
})
export const capacitorPins = lrPolarPins

expectTypesMatch<CapacitorProps, z.input<typeof capacitorProps>>(true)
