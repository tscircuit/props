import { resistance } from "circuit-json"
import { createConnectionsProp } from "lib/common/connectionsProp"
import {
  type CommonComponentProps,
  commonComponentProps,
  lrPins,
} from "lib/common/layout"
import {
  type SchematicOrientation,
  schematicOrientation,
} from "lib/common/schematicOrientation"
import {
  type SchematicSymbolSize,
  schematicSymbolSize,
} from "lib/common/schematicSize"
import { expectTypesMatch } from "lib/typecheck"
import type { Connections } from "lib/utility-types/connections-and-selectors"
import type { z } from "zod"

export const lightDependentResistorPinLabels = [
  "pin1",
  "pin2",
  "pos",
  "neg",
] as const
export type LightDependentResistorPinLabels =
  (typeof lightDependentResistorPinLabels)[number]

export interface LightDependentResistorProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  darkResistance?: number | string
  lightResistance?: number | string
  schOrientation?: SchematicOrientation
  schSize?: SchematicSymbolSize
  connections?: Connections<LightDependentResistorPinLabels>
}

export const lightDependentResistorProps = commonComponentProps.extend({
  darkResistance: resistance.optional(),
  lightResistance: resistance.optional(),

  schOrientation: schematicOrientation.optional(),
  schSize: schematicSymbolSize.optional(),

  connections: createConnectionsProp(
    lightDependentResistorPinLabels,
  ).optional(),
})
export const lightDependentResistorPins = lrPins

type InferredLightDependentResistorProps = z.input<
  typeof lightDependentResistorProps
>
expectTypesMatch<
  LightDependentResistorProps,
  InferredLightDependentResistorProps
>(true)
