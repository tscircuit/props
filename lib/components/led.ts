import { z } from "zod"
import { commonComponentProps, lrPolarPins } from "../types/common"

export const ledProps = commonComponentProps.extend({
  color: z.string().optional(),
})
export const ledPins = lrPolarPins
export type LedProps = z.input<typeof ledProps>
