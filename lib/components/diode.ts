import { commonComponentProps, lrPolarPins } from "lib/common/layout"
import type { z } from "zod"

export const diodeProps = commonComponentProps.extend({})
export const diodePins = lrPolarPins
export type DiodeProps = z.input<typeof diodeProps>
