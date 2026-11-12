import { signalBitRate, signalTimeOrUi } from "lib/common/signal-integrity"
import { expectTypesMatch } from "lib/typecheck"
import type { ReactNode } from "react"
import { z } from "zod"

/** One coupled SI test using the typical IBIS corner, ideal die rails with package parasitics, and passive unlisted nets. Rendering and board-dependent diagnostics belong to core. */
export interface PcbTransientChannelSimulationProps {
  /** Required when the board contains more than one SI block. */
  name?: string
  /** Default signal bit rate. Raw and parsed numbers are bit/s. */
  bitRate: string | number
  /** Positive, finite time or UI at the block bit rate; parsed to seconds. Absent stays absent for the pipeline to choose automatically; present is an explicit recording bound. */
  duration?: string | number
  /** Treat unrouted traces as ideal connections instead of reporting an error. Default: false. */
  allowUnroutedTraces?: boolean
  children?: ReactNode
}

export const pcbTransientChannelSimulationProps = z
  .object({
    name: z.string().trim().min(1).optional(),
    bitRate: signalBitRate,
    // NaN is accepted here so it gets the same RFC diagnostic as other bad durations.
    duration: z.union([z.string(), z.number(), z.nan()]).optional(),
    allowUnroutedTraces: z.boolean().default(false),
    children: z.custom<ReactNode>().optional(),
  })
  .strict()
  .transform(({ duration, ...props }, ctx) => {
    if (duration === undefined)
      return props as typeof props & { duration?: number }
    // UI durations become seconds at the block bit rate; time strings are already seconds.
    const parsed = signalTimeOrUi.safeParse(duration)
    const value = parsed.success ? String(parsed.data) : ""
    const seconds = value.endsWith("UI")
      ? Number.parseFloat(value) / props.bitRate
      : Number(value)
    if (!(seconds > 0 && Number.isFinite(seconds))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["duration"],
        message: "duration must be finite and greater than zero.",
      })
      return z.NEVER
    }
    return { ...props, duration: seconds }
  })

expectTypesMatch<
  PcbTransientChannelSimulationProps,
  z.input<typeof pcbTransientChannelSimulationProps>
>(true)
