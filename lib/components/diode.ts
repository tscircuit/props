import { commonComponentProps, lrPolarPins } from "lib/common/layout"
import { z } from "zod"
import type { Connections } from "./chip"

const connectionTarget = z
  .string()
  .or(z.array(z.string()).readonly())
  .or(z.array(z.string()))

const connectionsProp = z
  .custom<Connections>()
  .pipe(z.record(z.string(), connectionTarget))

export const diodeProps = commonComponentProps.extend({
  connections: connectionsProp.optional(),
})

export const diodePins = lrPolarPins

export type DiodeProps = z.input<typeof diodeProps>
