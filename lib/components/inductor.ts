import { z } from "zod"
import { commonComponentProps, lrPins } from "../types/common"
import { inductance } from "@tscircuit/soup"

export const inductorProps = commonComponentProps.extend({
  inductance,
})
export const inductorPins = lrPins
export type InductorProps = z.input<typeof inductorProps>
