import { z } from "zod"
import { commonComponentProps } from "../common/layout"
import { distance } from "circuit-json"

export const potentiometerProps = commonComponentProps.extend({
  resistance: distance,
  wiper: z.number().min(0).max(1).optional().default(0.5),
  rotation: z.number().optional(),
})

export type PotentiometerProps = z.input<typeof potentiometerProps>
