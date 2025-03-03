import { distance } from "circuit-json"
import type { Distance } from "lib/common/distance"
import {
  type CommonComponentProps,
  commonComponentProps,
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
import { z } from "zod"

export type ConnectionTarget = string | readonly string[] | string[]
export type Connections<PinLabel extends string | number = string | number> =
  Record<PinLabel, ConnectionTarget>

export interface ChipProps<PinLabel extends string | number = string | number>
  extends CommonComponentProps {
  manufacturerPartNumber?: string
  pinLabels?: Record<PinLabel, string | readonly string[] | string[]>
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
}

export type PinLabels<PinLabel extends string | number = string | number> =
  Record<PinLabel, string | readonly string[] | string[]>

const connectionTarget = z
  .string()
  .or(z.array(z.string()).readonly())
  .or(z.array(z.string()))

const connectionsProp = z.record(z.number().or(z.string()), connectionTarget)

export const pinLabelsProp = z.record(
  z.number().or(z.string()),
  z.string().or(z.array(z.string()).readonly()).or(z.array(z.string())),
)

expectTypesMatch<PinLabels, z.input<typeof pinLabelsProp>>(true)

export const chipProps = commonComponentProps.extend({
  manufacturerPartNumber: z.string().optional(),
  pinLabels: z
    .record(
      z.number().or(z.string()),
      z.string().or(z.array(z.string()).readonly()).or(z.array(z.string())),
    )
    .optional(),
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
})

/**
 * @deprecated Use ChipProps instead.
 */
export const bugProps = chipProps
export type InferredChipProps = z.input<typeof chipProps>

expectTypesMatch<InferredChipProps, ChipProps>(true)
