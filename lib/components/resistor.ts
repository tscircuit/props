import { resistance } from "circuit-json"
import { createConnectionsProp } from "lib/common/connectionsProp"
import {
  type CommonComponentProps,
  commonComponentProps,
  lrPins,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import type { Connections } from "lib/utility-types/connections-and-selectors"
import { z } from "zod"

export const resistorPinLabels = ["pin1", "pin2", "pos", "neg"] as const
export type ResistorPinLabels = (typeof resistorPinLabels)[number]

export interface ResistorProps extends CommonComponentProps {
  resistance: number | string
  pullupFor?: string
  pullupTo?: string
  pulldownFor?: string
  pulldownTo?: string
  connections?: Connections<ResistorPinLabels>
  ptc?: boolean
  ntc?: boolean
}

export const resistorProps = commonComponentProps.extend({
  resistance,

  pullupFor: z.string().optional(),
  pullupTo: z.string().optional(),

  pulldownFor: z.string().optional(),
  pulldownTo: z.string().optional(),

  connections: createConnectionsProp(resistorPinLabels).optional(),
  ptc: z.boolean().optional(),
  ntc: z.boolean().optional(),
})
export const resistorPins = lrPins

type InferredResistorProps = z.input<typeof resistorProps>
expectTypesMatch<ResistorProps, InferredResistorProps>(true)
