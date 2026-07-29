import type { z } from "zod"

export const validateStrictlyIncreasingWaveformTimes = (
  points: ReadonlyArray<Record<"time", number>>,
  context: z.RefinementCtx,
) => {
  for (let index = 1; index < points.length; index++) {
    if (points[index]!.time <= points[index - 1]!.time) {
      context.addIssue({
        code: "custom",
        path: [index, "time"],
        message: "Waveform times must be strictly increasing",
      })
    }
  }
}
