import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import type { Connections } from "lib/utility-types/connections-and-selectors"
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
  connections?: Connections<transistorPinsLabels>
}

export const transistorProps = commonComponentProps.extend({
  type: z.enum(["npn", "pnp", "bjt", "jfet", "mosfet", "igbt"]),
  connections: createConnectionsProp(transistorPinsLabels).optional(),
})

export const transistorPins = [
  "pin1",
  "emitter",
  "pin2",
  "collector",
  "pin3",
  "base",
] as const
export type TransistorPinLabels = (typeof transistorPins)[number]

type InferredTransistorProps = z.input<typeof transistorProps>
expectTypesMatch<TransistorProps, InferredTransistorProps>(true)
