import { z } from "zod"
import { commonComponentProps, lrPins } from "../types/common"
import { resistance } from "@tscircuit/soup"

export const resistorProps = commonComponentProps.extend({
  resistance,
})
export const resistorPins = lrPins
export type ResistorProps = z.input<typeof resistorProps>
