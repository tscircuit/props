import { inductance } from "circuit-json"
import {
  type CommonComponentProps,
  commonComponentProps,
  lrPins,
} from "lib/common/layout"
import { createConnectionsProp } from "lib/common/connectionsProp"
import {
  schematicOrientation,
  type SchematicOrientation,
} from "lib/common/schematicOrientation"
import type { Connections } from "lib/utility-types/connections-and-selectors"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export const inductorPins = lrPins
export type InductorPinLabels = (typeof inductorPins)[number]

export interface InductorProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  inductance: number | string
  maxCurrentRating?: number | string
  schOrientation?: SchematicOrientation
  connections?: Connections<InductorPinLabels>
}

export const inductorProps = commonComponentProps.extend({
  inductance,
  maxCurrentRating: z.union([z.string(), z.number()]).optional(),
  schOrientation: schematicOrientation.optional(),
  connections: createConnectionsProp(inductorPins).optional(),
})

type InferredInductorProps = z.input<typeof inductorProps>

expectTypesMatch<InductorProps, InferredInductorProps>(true)
