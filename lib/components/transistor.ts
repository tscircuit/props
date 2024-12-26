import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface TransistorProps extends CommonComponentProps {
  transistorType: "npn" | "pnp"
}

export const transistorProps = commonComponentProps.extend({
  transistorType: z.enum(["npn", "pnp"]),
})

type InferredTransistorProps = z.input<typeof transistorProps>
expectTypesMatch<TransistorProps, InferredTransistorProps>(true)
