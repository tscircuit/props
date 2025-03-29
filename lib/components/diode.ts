import {
  type CommonComponentProps,
  commonComponentProps,
  lrPolarPins,
} from "lib/common/layout"
import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"

const diodeConnectionKeys = z.enum([
  "anode",
  "cathode",
  "pin1",
  "pin2",
  "pos",
  "neg",
])

const connectionTarget = z
  .string()
  .or(z.array(z.string()).readonly())
  .or(z.array(z.string()))

const connectionsProp = z.record(diodeConnectionKeys, connectionTarget)

export const diodeProps = commonComponentProps.extend({
  connections: connectionsProp.optional(),
})

export const diodePins = lrPolarPins

export interface DiodeProps extends CommonComponentProps {
  connections?: {
    anode?: string | string[] | readonly string[]
    cathode?: string | string[] | readonly string[]
    pin1?: string | string[] | readonly string[]
    pin2?: string | string[] | readonly string[]
    pos?: string | string[] | readonly string[]
    neg?: string | string[] | readonly string[]
  }
}

export type InferredDiodeProps = z.input<typeof diodeProps>
expectTypesMatch<InferredDiodeProps, DiodeProps>(true)
