import { ms } from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

/** Binary traffic for one external transient. Numeric times are milliseconds. */
export interface AnalogDigitalStimulusProps {
  name: string
  /** Selector for the external analog.transientsimulation experiment. */
  simulationRef: string
  /** Selector for the physical source pin driven by this stimulus. */
  sourcePinRef: string
  bitDuration: number | string
  startTime: number | string
  /** Initial bit before optional inversion. No traffic defaults are inferred. */
  initialState: 0 | 1
  inverted?: boolean
  transmittedData: {
    transmissionType: "bits"
    bits: string | [0 | 1, ...(0 | 1)[]]
    repeat: boolean
  }
}
export const analogDigitalStimulusProps = z
  .object({
    name: z.string().min(1),
    simulationRef: z.string().min(1),
    sourcePinRef: z.string().min(1),
    bitDuration: ms.refine(
      (milliseconds) => Number.isFinite(milliseconds) && milliseconds > 0,
    ),
    startTime: ms.refine(
      (milliseconds) => Number.isFinite(milliseconds) && milliseconds >= 0,
    ),
    initialState: z.union([z.literal(0), z.literal(1)]),
    inverted: z.boolean().default(false),
    transmittedData: z
      .object({
        transmissionType: z.literal("bits"),
        bits: z.union([
          z.string().regex(/^[01]+$/),
          z.array(z.union([z.literal(0), z.literal(1)])).nonempty(),
        ]),
        repeat: z.boolean(),
      })
      .strict(),
  })
  .strict()
expectTypesMatch<
  AnalogDigitalStimulusProps,
  z.input<typeof analogDigitalStimulusProps>
>(true)
