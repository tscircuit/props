import { capacitance, distance, resistance, voltage } from "circuit-json"
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
  extends CommonComponentProps<PinLabel> {
  capacitance: number | string
  maxVoltageRating?: number | string
  tolerance?: number | string
  temperatureCoefficient?: string
  equivalentSeriesResistance?: number | string
  esr?: number | string
  schShowRatings?: boolean
  polarized?: boolean
  decouplingFor?: string
  decouplingTo?: string
  bypassFor?: string
  bypassTo?: string
  /** Maximum allowed PCB trace length between this capacitor and the component it decouples */
  maxDecouplingTraceLength?: number | string
  schOrientation?: SchematicOrientation
  schSize?: SchematicSymbolSize
  connections?: Connections<CapacitorPinLabels>
}

export const capacitorProps = commonComponentProps.extend({
  capacitance,
  maxVoltageRating: voltage.optional(),
  tolerance: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === "string") {
        if (val.endsWith("%")) {
          return parseFloat(val.slice(0, -1)) / 100
        }
        return parseFloat(val)
      }
      return val
    })
    .pipe(
      z
        .number()
        .min(0, "Tolerance must be non-negative")
        .max(1, "Tolerance cannot be greater than 100%"),
    )
    .optional(),
  temperatureCoefficient: z.string().optional(),
  equivalentSeriesResistance: resistance.optional(),
  esr: resistance.optional(),
  schShowRatings: z.boolean().optional().default(false),
  polarized: z.boolean().optional().default(false),
  decouplingFor: z.string().optional(),
  decouplingTo: z.string().optional(),
  bypassFor: z.string().optional(),
  bypassTo: z.string().optional(),
  maxDecouplingTraceLength: distance.optional(),
  schOrientation: schematicOrientation.optional(),
  schSize: schematicSymbolSize.optional(),
  connections: createConnectionsProp(capacitorPinLabels).optional(),
})
export const capacitorPins = lrPolarPins

expectTypesMatch<CapacitorProps, z.input<typeof capacitorProps>>(true)
