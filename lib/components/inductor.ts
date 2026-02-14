import { inductance } from "circuit-json"
import { createConnectionsProp } from "lib/common/connectionsProp"
import {
  type CommonComponentProps,
  commonComponentProps,
  lrPins,
} from "lib/common/layout"
import {
  type SchematicOrientation,
  schematicOrientation,
} from "lib/common/schematicOrientation"
import { expectTypesMatch } from "lib/typecheck"
import type { Connections } from "lib/utility-types/connections-and-selectors"
import { z } from "zod"

export const inductorPins = lrPins
export type InductorPinLabels = (typeof inductorPins)[number]

export interface InductorProps<PinLabel extends string = string>
  extends Omit<CommonComponentProps<PinLabel>, "name"> {
  name?: string
  inductance: number | string
  maxCurrentRating?: number | string
  schOrientation?: SchematicOrientation
  connections?: Connections<InductorPinLabels>
}

export const inductorProps = commonComponentProps.omit({ name: true }).extend({
  name: z.string().optional(),
  inductance,
  maxCurrentRating: z.union([z.string(), z.number()]).optional(),
  schOrientation: schematicOrientation.optional(),
  connections: createConnectionsProp(inductorPins).optional(),
})

type InferredInductorProps = z.input<typeof inductorProps>

expectTypesMatch<InductorProps, InferredInductorProps>(true)
