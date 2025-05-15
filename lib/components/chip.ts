import { distance } from "circuit-json"
import type { Distance } from "lib/common/distance"
import {
  type CommonComponentProps,
  commonComponentProps,
  type SupplierPartNumbers,
  supplier_name,
} from "lib/common/layout"
import {
  type SchematicPortArrangement,
  schematicPortArrangement as schematicPinArrangement,
} from "lib/common/schematicPinDefinitions"
import {
  type SchematicPinStyle,
  schematicPinStyle,
} from "lib/common/schematicPinStyle"
import { expectTypesMatch } from "lib/typecheck"
import type { Connections } from "lib/utility-types/connections-and-selectors"
import { z } from "zod"

export type PinLabelsProp<
  PinNumber extends string = string,
  PinLabel extends string = string,
> = Record<PinNumber, PinLabel | readonly PinLabel[] | PinLabel[]>

export type PinLabelFromPinLabelMap<PinLabelMap extends PinLabelsProp> =
  PinLabelMap extends PinLabelsProp<infer PinNumber, infer PinLabel>
    ? PinLabel
    : never

export interface ChipPropsSU<PinLabel extends string = string>
  extends CommonComponentProps {
  manufacturerPartNumber?: string
  pinLabels?: PinLabelsProp<string, PinLabel>
  schPinArrangement?: SchematicPortArrangement
  /** @deprecated Use schPinArrangement instead. */
  schPortArrangement?: SchematicPortArrangement
  schPinStyle?: SchematicPinStyle
  schPinSpacing?: Distance
  schWidth?: Distance
  schHeight?: Distance
  noSchematicRepresentation?: boolean
  internallyConnectedPins?: string[][]
  externallyConnectedPins?: string[][]
  connections?: Connections<PinLabel>
  pinCompatibleReplacements?: Array<{
    manufacturerPartNumber: string
    supplierPartNumbers?: SupplierPartNumbers
  }>
}

export type ChipProps<PinLabelMap extends PinLabelsProp | string = string> =
  ChipPropsSU<
    PinLabelMap extends PinLabelsProp
      ? PinLabelFromPinLabelMap<PinLabelMap>
      : PinLabelMap
  >

/**
 * Get the pin labels for a component
 *
 *   const pinLabels = { pin1: "VCC", pin2: "GND", pin3: "DATA" } as const
 *   export const MyChip = (props: ChipProps<typeof pinLabels>) => {
 *     // ...
 *   }
 *   type MyChipPinLabels = ChipPinLabels<typeof MyChip>
 *   // MyChipPinLabels is "VCC" | "GND" | "DATA"
 *
 */
export type ChipPinLabels<T extends (props: ChipProps<any>) => any> =
  T extends (props: infer Props) => any
    ? Props extends ChipProps<infer PinLabelMap>
      ? PinLabelMap extends PinLabelsProp
        ? PinLabelFromPinLabelMap<PinLabelMap>
        : PinLabelMap extends string
          ? PinLabelMap
          : never
      : never

/**
 * Get the connection prop type for a component
 *
 *   const pinLabels = { pin1: "VCC", pin2: "GND", pin3: "DATA" } as const
 *   export const MyChip = (props: ChipProps<typeof pinLabels>) => {
 *     // ...
 *   }
 *   const connections: ChipConnections<typeof MyChip> = {
 *     VCC: "...",
 *     GND: "...",
 *     DATA: "...",
 *   }
 *
 */
export type ChipConnections<T extends (props: ChipProps<any>) => any> = {
  [K in ChipPinLabels<T>]: string
}

const connectionTarget = z
  .string()
  .or(z.array(z.string()).readonly())
  .or(z.array(z.string()))

const connectionsProp = z
  .custom<Connections>()
  .pipe(z.record(z.string(), connectionTarget))

export const pinLabelsProp = z.record(
  z.string(),
  z.string().or(z.array(z.string()).readonly()).or(z.array(z.string())),
)

expectTypesMatch<PinLabelsProp, z.input<typeof pinLabelsProp>>(true)

export const chipProps = commonComponentProps.extend({
  manufacturerPartNumber: z.string().optional(),
  pinLabels: pinLabelsProp.optional(),
  internallyConnectedPins: z.array(z.array(z.string())).optional(),
  externallyConnectedPins: z.array(z.array(z.string())).optional(),
  schPinArrangement: schematicPinArrangement.optional(),
  schPortArrangement: schematicPinArrangement.optional(),
  schPinStyle: schematicPinStyle.optional(),
  schPinSpacing: distance.optional(),
  schWidth: distance.optional(),
  schHeight: distance.optional(),
  noSchematicRepresentation: z.boolean().optional(),
  connections: connectionsProp.optional(),
  pinCompatibleReplacements: z.array(z.object({
    manufacturerPartNumber: z.string(),
    supplierPartNumbers: z.record(supplier_name, z.array(z.string())).optional()
  })).optional(),
})

/**
 * @deprecated Use ChipProps instead.
 */
export const bugProps = chipProps
export type InferredChipProps = z.input<typeof chipProps>

// Chip props are too complex to match up with zod types, we typecheck
// them separately in the test files
expectTypesMatch<InferredChipProps, ChipPropsSU<string>>(true)