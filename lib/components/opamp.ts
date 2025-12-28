import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import { createConnectionsProp } from "lib/common/connectionsProp"
import { expectTypesMatch } from "lib/typecheck"
import type { Connections } from "lib/utility-types/connections-and-selectors"
import { z } from "zod"

export const opampPinLabels = [
  "inverting_input",
  "non_inverting_input",
  "output",
  "positive_supply",
  "negative_supply",
  "vcc",
  "gnd",
  "vee",
  "vss",
  "vdd",
  "in_neg",
  "in_pos",
  "out",
  "vs+",
  "v+",
  "vs-",
  "v-",
] as const

/**
 * Pin labels for an op-amp component. This includes common aliases.
 */
export type OpAmpPinLabels = (typeof opampPinLabels)[number]

export interface OpAmpProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  connections?: Connections<OpAmpPinLabels>
}

/**
 * Zod schema for validating op-amp props.
 */
export const opampProps = commonComponentProps.extend({
  connections: createConnectionsProp(opampPinLabels).optional(),
})

/**
 * The standard five pins for an op-amp.
 * Used for building schematic symbols.
 */
export const opampPins = [
  "inverting_input",
  "non_inverting_input",
  "output",
  "positive_supply",
  "negative_supply",
] as const

type InferredOpAmpProps = z.input<typeof opampProps>
expectTypesMatch<OpAmpProps, InferredOpAmpProps>(true)
