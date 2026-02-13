import { frequency, ms } from "circuit-json"
import { connectionTarget } from "lib/common/connectionsProp"
import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import type { Connections } from "lib/utility-types/connections-and-selectors"

import { z } from "zod"

export interface SwitchProps extends Omit<CommonComponentProps, "name"> {
  name?: string
  type?: "spst" | "spdt" | "dpst" | "dpdt"
  isNormallyClosed?: boolean
  spdt?: boolean
  spst?: boolean
  dpst?: boolean
  dpdt?: boolean
  simSwitchFrequency?: number | string
  simCloseAt?: number | string
  simOpenAt?: number | string
  simStartClosed?: boolean
  simStartOpen?: boolean
  connections?: Connections<string>
}

export const switchProps = commonComponentProps
  .omit({ name: true })
  .extend({
    name: z.string().optional(),
    type: z.enum(["spst", "spdt", "dpst", "dpdt"]).optional(),
    isNormallyClosed: z.boolean().optional().default(false),
    spst: z.boolean().optional(),
    spdt: z.boolean().optional(),
    dpst: z.boolean().optional(),
    dpdt: z.boolean().optional(),
    simSwitchFrequency: frequency.optional(),
    simCloseAt: ms.optional(),
    simOpenAt: ms.optional(),
    simStartClosed: z.boolean().optional(),
    simStartOpen: z.boolean().optional(),
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
