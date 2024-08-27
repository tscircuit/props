import { z } from "zod"
import { commonComponentProps, lrPolarPins } from "../types/common"

export const diodeProps = commonComponentProps.extend({})
export const diodePins = lrPolarPins
export type DiodeProps = z.input<typeof diodeProps>
