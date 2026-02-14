import { createConnectionsProp } from "lib/common/connectionsProp"
import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import type { Connections } from "lib/utility-types/connections-and-selectors"
import { z } from "zod"

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
  extends Omit<CommonComponentProps<PinLabel>, "name"> {
  name?: string
  type: "npn" | "pnp" | "bjt" | "jfet" | "mosfet" | "igbt"
  connections?: Connections<transistorPinsLabels>
}

export const transistorProps = commonComponentProps
  .omit({ name: true })
  .extend({
    name: z.string().optional(),
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
