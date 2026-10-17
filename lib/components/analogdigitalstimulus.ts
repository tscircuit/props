import { ms } from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

/** Binary traffic for one external transient. Numeric times are milliseconds. */
export interface AnalogDigitalStimulusProps {
  name: string
  /** Selector for the external analog.transientsimulation experiment. */
  simulationRef: string
  /** Selector for the physical source pin driven by this stimulus. */
  drives: string
  unitInterval: number | string
  startTime: number | string
  /** Initial bit before optional inversion. No traffic defaults are inferred. */
  initialState: 0 | 1
  inverted?: boolean
  pattern: { type: "bits"; bits: string; repeat: boolean }
}
export const analogDigitalStimulusProps = z
  .object({
    name: z.string().min(1),
    simulationRef: z.string().min(1),
    drives: z.string().min(1),
    unitInterval: ms.refine(
      (milliseconds) => Number.isFinite(milliseconds) && milliseconds > 0,
    ),
    startTime: ms.refine(
      (milliseconds) => Number.isFinite(milliseconds) && milliseconds >= 0,
    ),
    initialState: z.union([z.literal(0), z.literal(1)]),
    inverted: z.boolean().default(false),
    pattern: z
      .object({
        type: z.literal("bits"),
        bits: z.string().regex(/^[01]+$/),
        repeat: z.boolean(),
      })
      .strict(),
  })
  .strict()
expectTypesMatch<
  AnalogDigitalStimulusProps,
  z.input<typeof analogDigitalStimulusProps>
>(true)
