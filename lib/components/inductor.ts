import { inductance } from "circuit-json"
import {
  type CommonComponentProps,
  commonComponentProps,
  lrPins,
} from "lib/common/layout"
import {
  schematicOrientation,
  type SchematicOrientation,
} from "lib/common/schematicOrientation"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface InductorProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  inductance: number | string
  maxCurrentRating?: number | string
  schOrientation?: SchematicOrientation
}

export const inductorProps = commonComponentProps.extend({
  inductance,
  maxCurrentRating: z.union([z.string(), z.number()]).optional(),
  schOrientation: schematicOrientation.optional(),
})

export const inductorPins = lrPins
export type InductorPinLabels = (typeof inductorPins)[number]

type InferredInductorProps = z.input<typeof inductorProps>

expectTypesMatch<InductorProps, InferredInductorProps>(true)
