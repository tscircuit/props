import { signalBitRate, signalDurationOrUi } from "lib/common/signal-integrity"
import { expectTypesMatch } from "lib/typecheck"
import type { ReactNode } from "react"
import { z } from "zod"

/** One coupled SI test using the typical IBIS corner, ideal die rails with package parasitics, and passive unlisted nets. Rendering and board-dependent diagnostics belong to core. */
export interface PcbTransientChannelSimulationProps {
  /** Required when the board contains more than one SI block. */
  name?: string
  /** Default signal bit rate. Raw and parsed numbers are bit/s. */
  bitRate: string | number
  /** Positive, finite time or UI. Parsed times are seconds; UI stays a normalized string like offset, for core to resolve at the block bit rate. Absent stays absent for the pipeline to choose automatically; present is an explicit recording bound. */
  duration?: string | number
  /** Treat unrouted traces as ideal connections instead of reporting an error. Default: false. */
  allowUnroutedTraces?: boolean
  children?: ReactNode
}

export const pcbTransientChannelSimulationProps = z
  .object({
    name: z.string().trim().min(1).optional(),
    bitRate: signalBitRate,
    duration: signalDurationOrUi.optional(),
    allowUnroutedTraces: z.boolean().default(false),
    children: z.custom<ReactNode>().optional(),
  })
  .strict()

expectTypesMatch<
  PcbTransientChannelSimulationProps,
  z.input<typeof pcbTransientChannelSimulationProps>
>(true)
