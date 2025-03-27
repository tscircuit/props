import { commonComponentProps, lrPolarPins } from "lib/common/layout"
import { z } from "zod"

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

export type DiodeProps = z.input<typeof diodeProps>
