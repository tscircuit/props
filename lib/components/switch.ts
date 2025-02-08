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
  isSPDT?: boolean
  isSPST?: boolean
  isDPST?: boolean
  isDPDT?: boolean
}

export const switchProps = commonComponentProps
  .extend({
    ftype: z.literal("switch"),
    type: z.enum(["spst", "spdt", "dpst", "dpdt"]),
    isNormallyClosed: z.boolean().optional().default(false),
  })
  .transform((val) => {
    // Add boolean properties based on 'type'
    const updatedVal: SwitchProps = { ...val }
    switch (updatedVal.type) {
      case "spdt":
        updatedVal.isSPDT = true
        break
      case "spst":
        updatedVal.isSPST = true
        break
      case "dpst":
        updatedVal.isDPST = true
        break
      case "dpdt":
        updatedVal.isDPDT = true
        break
    }

    return updatedVal
  })

export type InferredSwitchProps = z.infer<typeof switchProps>
expectTypesMatch<SwitchProps, InferredSwitchProps>(true)
