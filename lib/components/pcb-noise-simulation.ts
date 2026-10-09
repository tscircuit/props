import { expectTypesMatch } from "lib/typecheck"
import type { ReactNode } from "react"
import { z } from "zod"
import { positiveQuantity, strictQuantity } from "../simulation/strict-quantity"

/** Defines a pending physical PCB noise experiment. Rendering does not run a solver. */
export interface PcbNoiseSimulationProps {
  name?: string
  /** Record duration. Numbers are seconds; unit strings include ns, ps and s. */
  duration: number | string
  /** Full-resolution sample interval in seconds, never display decimation. */
  sampleInterval: number | string
  /** Paired reference run: hold only these named aggressor channels' sources at the explicit voltage. */
  baseline?: {
    quietChannels: string[]
    voltage: number | string
  }
  children?: ReactNode
}

export const pcbNoiseSimulationProps = z
  .object({
    name: z.string().trim().min(1).optional(),
    duration: positiveQuantity("s", "seconds", "512ns"),
    sampleInterval: positiveQuantity("s", "seconds", "20ps"),
    baseline: z
      .object({
        quietChannels: z.array(z.string().trim().min(1)).min(1),
        voltage: strictQuantity("V", "volts", "0V"),
      })
      .strict()
      .refine((v) => new Set(v.quietChannels).size === v.quietChannels.length, {
        message: "Baseline channel names must be unique",
        path: ["quietChannels"],
      })
      .optional(),
    children: z.custom<ReactNode>().optional(),
  })
  .strict()
  .refine((v) => v.sampleInterval < v.duration, {
    message: "sampleInterval must be less than duration",
    path: ["sampleInterval"],
  })

expectTypesMatch<
  PcbNoiseSimulationProps,
  z.input<typeof pcbNoiseSimulationProps>
>(true)
