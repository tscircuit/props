import { inductance } from "circuit-json"
import {
  type CommonComponentProps,
  commonComponentProps,
  lrPins,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface InductorProps extends CommonComponentProps {
  inductance: number | string
  maxCurrentRating?: number | string
}

export const inductorProps = commonComponentProps.extend({
  inductance,
  maxCurrentRating: z.union([z.string(), z.number()]).optional(),
})

export const inductorPins = lrPins

type InferredInductorProps = z.input<typeof inductorProps>

expectTypesMatch<InductorProps, InferredInductorProps>(true)
