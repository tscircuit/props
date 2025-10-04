import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import { connectionTarget } from "lib/common/connectionsProp"
import type { Connections } from "lib/utility-types/connections-and-selectors"
import { expectTypesMatch } from "lib/typecheck"

import { z } from "zod"

export interface SwitchProps extends CommonComponentProps {
  type?: "spst" | "spdt" | "dpst" | "dpdt"
  isNormallyClosed?: boolean
  spdt?: boolean
  spst?: boolean
  dpst?: boolean
  dpdt?: boolean
  connections?: Connections<string>
}

export const switchProps = commonComponentProps
  .extend({
    type: z.enum(["spst", "spdt", "dpst", "dpdt"]).optional(),
    isNormallyClosed: z.boolean().optional().default(false),
    spst: z.boolean().optional(),
    spdt: z.boolean().optional(),
    dpst: z.boolean().optional(),
    dpdt: z.boolean().optional(),
    connections: z
      .custom<Connections<string>>()
      .pipe(z.record(z.string(), connectionTarget))
      .optional(),
  })
  .transform((props) => {
    const updatedProps: SwitchProps = { ...props }

    if (updatedProps.dpdt) {
      updatedProps.type = "dpdt"
    } else if (updatedProps.spst) {
      updatedProps.type = "spst"
    } else if (updatedProps.spdt) {
      updatedProps.type = "spdt"
    } else if (updatedProps.dpst) {
      updatedProps.type = "dpst"
    }

    switch (updatedProps.type) {
      case "spdt":
        updatedProps.spdt = true
        break
      case "spst":
        updatedProps.spst = true
        break
      case "dpst":
        updatedProps.dpst = true
        break
      case "dpdt":
        updatedProps.dpdt = true
        break
    }

    return updatedProps
  })

export type InferredSwitchProps = z.infer<typeof switchProps>
expectTypesMatch<SwitchProps, InferredSwitchProps>(true)
