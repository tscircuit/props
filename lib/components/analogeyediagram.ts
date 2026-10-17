import { ms } from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

/** Fixed-origin eye measurement. Numeric times are milliseconds; no compliance threshold is implied. */
export interface AnalogEyeDiagramProps {
  name: string
  simulationRef: string
  probeRef: string
  unitInterval: number | string
  timeOrigin: number | string
  /** Omitted gate endpoints use the experiment's recorded start/end times. */
  startTime?: number | string
  endTime?: number | string
}
const finiteMilliseconds = ms.refine(Number.isFinite)
export const analogEyeDiagramProps = z
  .object({
    name: z.string().min(1),
    simulationRef: z.string().min(1),
    probeRef: z.string().min(1),
    unitInterval: finiteMilliseconds.refine((milliseconds) => milliseconds > 0),
    timeOrigin: finiteMilliseconds,
    startTime: finiteMilliseconds
      .refine((milliseconds) => milliseconds >= 0)
      .optional(),
    endTime: finiteMilliseconds
      .refine((milliseconds) => milliseconds > 0)
      .optional(),
  })
  .strict()
  .superRefine((eye, context) => {
    if (
      eye.startTime !== undefined &&
      eye.endTime !== undefined &&
      eye.startTime >= eye.endTime
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endTime"],
        message: "Eye gate end must follow its start",
      })
    }
  })
expectTypesMatch<AnalogEyeDiagramProps, z.input<typeof analogEyeDiagramProps>>(
  true,
)
