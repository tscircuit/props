import { resistance } from "circuit-json"
import { createConnectionsProp } from "lib/common/connectionsProp"
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
import type { Connections } from "lib/utility-types/connections-and-selectors"
import { z } from "zod"

export const resistorPinLabels = ["pin1", "pin2", "pos", "neg"] as const
export type ResistorPinLabels = (typeof resistorPinLabels)[number]

export interface ResistorProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  resistance: number | string
  pullupFor?: string
  pullupTo?: string
  pulldownFor?: string
  pulldownTo?: string
  schOrientation?: SchematicOrientation
  connections?: Connections<ResistorPinLabels>
}

export const resistorProps = commonComponentProps.extend({
  resistance,

  pullupFor: z.string().optional(),
  pullupTo: z.string().optional(),

  pulldownFor: z.string().optional(),
  pulldownTo: z.string().optional(),

  schOrientation: schematicOrientation.optional(),

  connections: createConnectionsProp(resistorPinLabels).optional(),
})
export const resistorPins = lrPins

type InferredResistorProps = z.input<typeof resistorProps>
expectTypesMatch<ResistorProps, InferredResistorProps>(true)
