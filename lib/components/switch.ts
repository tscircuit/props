import { commonComponentProps } from "lib/common/layout"
import { z } from "zod"

export const switchProps = commonComponentProps.extend({
  ftype: z.literal("switch"),
  switchType: z.enum(["spst"]).default("spst"),
  isNormallyClosed: z.boolean().default(false),
})
export type SwitchProps = z.input<typeof switchProps>
