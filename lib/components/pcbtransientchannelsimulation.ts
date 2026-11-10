import { signalBitRate, signalTimeOrUi } from "lib/common/signalIntegrity"
import { expectTypesMatch } from "lib/typecheck"
import type { ReactNode } from "react"
import { z } from "zod"

/** One coupled SI test. Rendering and board-dependent diagnostics belong to core. */
export interface PcbTransientChannelSimulationProps {
  /** Required when the board contains more than one SI block. */
  name?: string
  /** Default signal bit rate. Raw and parsed numbers are bit/s. */
  bitRate: string | number
  /** Positive, finite time or UI at the block bit rate; parsed to seconds. Absent stays absent for the pipeline to choose automatically; present is an explicit recording bound. */
  duration?: string | number
  corner?: "typical" | "minimum" | "maximum"
  unlistedNets?: "passive"
  unrouted?: "error" | "ideal"
  /** "ideal" (default): perfect rails from the selected IBIS models at the test corner. "extracted" is not implemented yet. */
  pdn?: "extracted" | "ideal"
  children?: ReactNode
}

export const pcbTransientChannelSimulationProps = z
  .object({
    name: z.string().trim().min(1).optional(),
    bitRate: signalBitRate,
    duration: z
      .custom<string | number>(
        (value) => typeof value === "string" || typeof value === "number",
        { message: "duration must be finite and greater than zero." },
      )
      .optional(),
    corner: z.enum(["typical", "minimum", "maximum"]).default("typical"),
    unlistedNets: z.literal("passive").default("passive"),
    unrouted: z.enum(["error", "ideal"]).default("error"),
    pdn: z.enum(["extracted", "ideal"]).default("ideal"),
    children: z.custom<ReactNode>().optional(),
  })
  .strict()
  .transform(({ duration, ...props }, ctx) => {
    const parsed =
      duration === undefined ? undefined : signalTimeOrUi.safeParse(duration)
    const time = parsed?.success ? parsed.data : undefined
    const seconds =
      typeof time === "string" ? Number.parseFloat(time) / props.bitRate : time
    if (
      duration !== undefined &&
      (seconds === undefined || !Number.isFinite(seconds) || seconds <= 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["duration"],
        message: "duration must be finite and greater than zero.",
      })
      return z.NEVER
    }
    return { ...props, ...(seconds === undefined ? {} : { duration: seconds }) }
  })

expectTypesMatch<
  PcbTransientChannelSimulationProps,
  z.input<typeof pcbTransientChannelSimulationProps>
>(true)
