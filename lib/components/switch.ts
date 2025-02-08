import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"

import { z } from "zod"

export interface SwitchProps extends CommonComponentProps {
  ftype: "switch"
  type: "spst" | "spdt" | "dpst" | "dpdt"
  isNormallyClosed?: boolean
}

export const switchProps = commonComponentProps.extend({
  ftype: z.literal("switch"),
  type: z.enum(["spst", "spdt", "dpst", "dpdt"]),
  isNormallyClosed: z.boolean().optional().default(false),
})

export type InferredSwitchProps = z.input<typeof switchProps>
expectTypesMatch<SwitchProps, InferredSwitchProps>(true)
