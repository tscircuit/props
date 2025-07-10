import { distance, supplier_name } from "circuit-json"
import type { Distance } from "lib/common/distance"
import {
  type CommonComponentProps,
  commonComponentProps,
  type SupplierPartNumbers,
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

export interface PinCompatibleVariant {
  manufacturerPartNumber?: string
  supplierPartNumber?: SupplierPartNumbers
}

export interface ChipPropsSU<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  manufacturerPartNumber?: string
  pinLabels?: PinLabelsProp<string, PinLabel>
  /**
   * Whether to show pin aliases in the schematic
   */
  showPinAliases?: boolean
  /**
   * Labels for PCB pins
   */
  pcbPinLabels?: Record<string, string>
  schPinArrangement?: SchematicPortArrangement
  /** @deprecated Use schPinArrangement instead. */
  schPortArrangement?: SchematicPortArrangement
  pinCompatibleVariants?: PinCompatibleVariant[]
  schPinStyle?: SchematicPinStyle
  schPinSpacing?: Distance
  schWidth?: Distance
  schHeight?: Distance
  noSchematicRepresentation?: boolean
  internallyConnectedPins?: string[][]
  externallyConnectedPins?: string[][]
  connections?: Connections<PinLabel>
}

export type ChipProps<PinLabelMap extends PinLabelsProp | string = string> =
  ChipPropsSU<
    PinLabelMap extends PinLabelsProp
      ? PinLabelFromPinLabelMap<PinLabelMap> | keyof PinLabelMap
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

export const pinCompatibleVariant = z.object({
  manufacturerPartNumber: z.string().optional(),
  supplierPartNumber: z.record(supplier_name, z.array(z.string())).optional(),
})

export const chipProps = commonComponentProps.extend({
  manufacturerPartNumber: z.string().optional(),
  pinLabels: pinLabelsProp.optional(),
  showPinAliases: z.boolean().optional(),
  pcbPinLabels: z.record(z.string(), z.string()).optional(),
  internallyConnectedPins: z.array(z.array(z.string())).optional(),
  externallyConnectedPins: z.array(z.array(z.string())).optional(),
  schPinArrangement: schematicPinArrangement.optional(),
  schPortArrangement: schematicPinArrangement.optional(),
  pinCompatibleVariants: z.array(pinCompatibleVariant).optional(),
  schPinStyle: schematicPinStyle.optional(),
  schPinSpacing: distance.optional(),
  schWidth: distance.optional(),
  schHeight: distance.optional(),
  noSchematicRepresentation: z.boolean().optional(),
  connections: connectionsProp.optional(),
})

/**
 * @deprecated Use ChipProps instead.
 */
export const bugProps = chipProps
export type InferredChipProps = z.input<typeof chipProps>

// Chip props are too complex to match up with zod types, we typecheck
// them separately in the test files
expectTypesMatch<InferredChipProps, ChipPropsSU<string>>(true)
