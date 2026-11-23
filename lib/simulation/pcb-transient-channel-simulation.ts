import { signalBitRate, signalDurationOrUi } from "lib/common/signal-integrity"
import { expectTypesMatch } from "lib/typecheck"
import type { ReactNode } from "react"
import { z } from "zod"

/**
 * One coupled SI test using the typical IBIS corner, ideal die rails with
 * package parasitics, and configurable aggressors. Other unlisted nets remain
 * passive. Core renders the simulation block. The simulation consumer validates
 * aggressor states against the board and its IBIS models.
 */
export interface PcbTransientChannelSimulationProps {
  /** Required when the board contains more than one SI block. */
  name?: string
  /** Default signal bit rate. Raw and parsed numbers are bit/s. */
  bitRate: string | number
  /** Positive, finite time or UI. Parsed times are seconds; UI stays a normalized string like offset, for core to resolve at the block bit rate. Absent stays absent for the pipeline to choose automatically; present is an explicit recording bound. */
  duration?: string | number
  /** Treat unrouted traces as ideal connections instead of reporting an error. Default: false. */
  allowUnroutedTraces?: boolean
  /**
   * Drive pattern for aggressors. Aggressors are output-capable pins coupled to
   * the simulation's channels, excluding the driver pins of all channels in
   * that simulation. Accepts a non-empty string after trimming, using channel
   * pattern syntax. "0" and "1" drive quiet low and high, while "prbs7",
   * "clock", or switching bits drive transitions. The channels keep their own
   * `pattern` and `driverDisabled` settings. Absent stays absent without a
   * default for the simulation consumer to interpret.
   */
  aggressorPattern?: string
  /**
   * Optional boolean. When true, tri-state every aggressor (high impedance) and
   * ignore `aggressorPattern`. Every aggressor's IBIS model must support
   * disabling its output. Explicit false is preserved and leaves
   * `aggressorPattern` in effect if supplied. Absent stays absent without a
   * default for the simulation consumer to interpret.
   */
  aggressorDisabled?: boolean
  children?: ReactNode
}

/** Parses the props for one PCB transient channel simulation. */
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
