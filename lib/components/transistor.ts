import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import type { Connections } from "lib/utility-types/connections-and-selectors"
import { pinLabelsProp, type PinLabelsProp } from "./chip"
import { createConnectionsProp } from "lib/common/connectionsProp"

export const transistorPinsLabels = [
  "pin1",
  "pin2",
  "pin3",
  "emitter",
  "collector",
  "base",
  "gate",
  "source",
  "drain",
] as const
export type transistorPinsLabels = (typeof transistorPinsLabels)[number]

export interface TransistorProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  type: "npn" | "pnp" | "bjt" | "jfet" | "mosfet" | "igbt"
  /**
   * Physical package pins mapped to semantic terminal names (and optional aliases).
   * For MMBT3904 SOT-23: { pin1: "base", pin2: "emitter", pin3: "collector" }.
   * Use full terminal names to retain schematic and simulation semantics.
   * Omit to retain the symbol's default pin order; no package pinout is inferred.
   */
  pinLabels?: PinLabelsProp<string, PinLabel>
  connections?: Connections<transistorPinsLabels>
}

export const transistorProps = commonComponentProps.extend({
  type: z.enum(["npn", "pnp", "bjt", "jfet", "mosfet", "igbt"]),
  pinLabels: pinLabelsProp.optional(),
  connections: createConnectionsProp(transistorPinsLabels).optional(),
})

export const transistorPins = [
  "pin1",
  "collector",
  "pin2",
  "base",
  "pin3",
  "emitter",
] as const
export type TransistorPinLabels = (typeof transistorPins)[number]

type InferredTransistorProps = z.input<typeof transistorProps>
expectTypesMatch<TransistorProps, InferredTransistorProps>(true)
