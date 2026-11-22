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
  /** Pattern for aggressors, the output-capable pins coupled to the selected channels outside their endpoints. Uses the channel pattern syntax. "0" and "1" drive quiet low and high, while "prbs7", "clock", or switching bits drive transitions. The selected channels (victims) keep their own `pattern` and `driverDisabled` settings. */
  aggressorPattern?: string
  /** Tri-state every aggressor (high impedance) and ignore aggressorPattern. Pattern "0" actively drives low. Every aggressor's IBIS model must support disabling its output. */
  aggressorDisabled?: boolean
  children?: ReactNode
}

export const pcbTransientChannelSimulationProps = z
  .object({
    name: z.string().trim().min(1).optional(),
    bitRate: signalBitRate,
    duration: signalDurationOrUi.optional(),
    allowUnroutedTraces: z.boolean().default(false),
    aggressorPattern: z.string().trim().min(1).optional(),
    aggressorDisabled: z.boolean().optional(),
    children: z.custom<ReactNode>().optional(),
  })
  .strict()

expectTypesMatch<
  PcbTransientChannelSimulationProps,
  z.input<typeof pcbTransientChannelSimulationProps>
>(true)
