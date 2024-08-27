import { z } from "zod"
import { commonComponentProps, lrPolarPins } from "../types/common"
import { capacitance } from "@tscircuit/soup"

export const capacitorProps = commonComponentProps.extend({
  capacitance,
})
export const capacitorPins = lrPolarPins
export type CapacitorProps = z.input<typeof capacitorProps>
