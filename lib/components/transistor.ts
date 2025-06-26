import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface TransistorProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  type: "npn" | "pnp" | "bjt" | "jfet" | "mosfet" | "igbt"
}

export const transistorProps = commonComponentProps.extend({
  type: z.enum(["npn", "pnp", "bjt", "jfet", "mosfet", "igbt"]),
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
