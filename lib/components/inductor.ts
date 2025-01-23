import { inductance } from "circuit-json"
import { commonComponentProps, lrPins } from "lib/common/layout"
import type { z } from "zod"

export const inductorProps = commonComponentProps.extend({
  inductance,
})
export const inductorPins = lrPins
export type InductorProps = z.input<typeof inductorProps>
