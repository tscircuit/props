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
  .transform((props) => {
    // Add boolean properties based on 'type'
    const updatedProp: SwitchProps = { ...props }
    switch (updatedProp.type) {
      case "spdt":
        updatedProp.spdt = true
        break
      case "spst":
        updatedProp.spst = true
        break
      case "dpst":
        updatedProp.dpst = true
        break
      case "dpdt":
        updatedProp.dpdt = true
        break
    }

    return updatedProp
  })

export type InferredSwitchProps = z.infer<typeof switchProps>
expectTypesMatch<SwitchProps, InferredSwitchProps>(true)
