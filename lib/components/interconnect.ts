import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface InterconnectProps extends CommonComponentProps {
  standard?: "TSC0001_36P_XALT_2025_11"
}

export const interconnectProps = commonComponentProps.extend({
  standard: z.enum(["TSC0001_36P_XALT_2025_11"]).optional(),
})

type InferredInterconnectProps = z.input<typeof interconnectProps>
expectTypesMatch<InterconnectProps, InferredInterconnectProps>(true)
