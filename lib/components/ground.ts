import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface GroundProps extends CommonComponentProps {
  type: "gnd" | "gnd2"
}

export const GroundProps = commonComponentProps.extend({
  type: z.enum(["gnd", "gnd2"]),
})

type InferredGroundProps = z.input<typeof GroundProps>
expectTypesMatch<GroundProps, InferredGroundProps>(true)
