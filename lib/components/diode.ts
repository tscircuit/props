import { commonComponentProps } from "lib/common/layout"
import { z } from "zod"

// Assuming `PinLabelsProp` is already defined elsewhere
export type PinLabelsProp<
  PinNumber extends string = string,
  PinLabel extends string = string,
> = Record<PinNumber, PinLabel | readonly PinLabel[] | PinLabel[]>

export type ConnectionTarget = string
export type Connections<PinLabel extends string = string> = Partial<
  Record<
    PinLabel,
    ConnectionTarget | ConnectionTarget[] | readonly ConnectionTarget[]
  >
>

// Define the connection target validation schema
const connectionTarget = z
  .string()
  .or(z.array(z.string()).readonly())
  .or(z.array(z.string()))

// Define the connections prop schema
const connectionsProp = z
  .custom<Connections>()
  .pipe(z.record(z.string(), connectionTarget))

// Now extend the `commonComponentProps` and add `pinLabels` using `PinLabelsProp` directly
export const diodeProps = commonComponentProps.extend({
  pinLabels: z.custom<PinLabelsProp<string, string>>().optional(), // pinLabels are optional
  connections: connectionsProp.optional(),
})

export type DiodeProps = z.input<typeof diodeProps>
