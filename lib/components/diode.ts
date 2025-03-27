import { commonComponentProps, lrPolarPins } from "lib/common/layout"
import { z } from "zod" // Import z as a value
import type { Connections } from "./chip" // Import Connections as a type

// Define connectionsProp using Connections
const connectionTarget = z
  .string()
  .or(z.array(z.string()).readonly())
  .or(z.array(z.string()))

const connectionsProp = z
  .custom<Connections>()
  .pipe(z.record(z.string(), connectionTarget))

export const diodeProps = commonComponentProps.extend({
  connections: connectionsProp.optional(), // Add the connections property
})

export const diodePins = lrPolarPins

export type DiodeProps = z.input<typeof diodeProps>
