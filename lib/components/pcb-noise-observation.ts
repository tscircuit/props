import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

/** Passive measurement of a physical port. Observing does not add a source or load. */
export interface PcbNoiseObservationProps {
  name: string
  port: string
  quantity: "voltage" | "current"
}

export const pcbNoiseObservationProps = z
  .object({
    name: z.string().trim().min(1),
    port: z.string().trim().min(1),
    quantity: z.enum(["voltage", "current"]),
  })
  .strict()

expectTypesMatch<
  PcbNoiseObservationProps,
  z.input<typeof pcbNoiseObservationProps>
>(true)
