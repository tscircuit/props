import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"

import { z } from "zod"

export interface SwitchProps extends CommonComponentProps {
  ftype: "switch"
  type?: "spst" | "spdt" | "dpst" | "dpdt"
  isNormallyClosed?: boolean
  spdt?: boolean
  spst?: boolean
  dpst?: boolean
  dpdt?: boolean
}

export const switchProps = commonComponentProps
  .extend({
    ftype: z.literal("switch"),
    type: z.enum(["spst", "spdt", "dpst", "dpdt"]).optional(),
    isNormallyClosed: z.boolean().optional().default(false),
  })
  .transform((val) => {
    // Add boolean properties based on 'type'
    const updatedVal: SwitchProps = { ...val }
    switch (updatedVal.type) {
      case "spdt":
        updatedVal.spdt = true
        break
      case "spst":
        updatedVal.spst = true
        break
      case "dpst":
        updatedVal.dpst = true
        break
      case "dpdt":
        updatedVal.dpdt = true
        break
    }

    return updatedVal
  })

export type InferredSwitchProps = z.infer<typeof switchProps>
expectTypesMatch<SwitchProps, InferredSwitchProps>(true)
