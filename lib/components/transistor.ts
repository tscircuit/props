import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface TransistorProps extends CommonComponentProps {
  type: "npn" | "pnp" | "bjt" | "jfet" | "mosfet"
}

export const transistorProps = commonComponentProps.extend({
  type: z.enum(["npn", "pnp", "bjt", "jfet", "mosfet"]),
})

export const transistorPins = [
  "pin1",
  "emitter",
  "pin2",
  "collector",
  "pin3",
  "base",
] as const

type InferredTransistorProps = z.input<typeof transistorProps>
expectTypesMatch<TransistorProps, InferredTransistorProps>(true)
