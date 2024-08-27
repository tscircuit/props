import { z } from "zod"
import { commonComponentProps } from "../types/common"

export const switchProps = commonComponentProps.extend({
  ftype: z.literal("switch"),
  switchType: z.enum(["spst"]).default("spst"),
  isNormallyClosed: z.boolean().default(false),
})
export type SwitchProps = z.input<typeof switchProps>
