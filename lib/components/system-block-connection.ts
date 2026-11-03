import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

/** A logical relationship between two blocks; does not create electrical traces. */
export interface SystemBlockConnectionProps {
  /** Optional stable connection identity, unique within its page when supplied. */
  name?: string
  /** Component name within the containing page, including inside nested groups. */
  from: string
  /** Component name within the same page; group names and pin selectors are not endpoints. */
  to: string
  /** Interface annotation such as I2C, SPI, or 3.3 V; not the connection's identity. */
  label?: string
  /** Relationship category; defaults to signal. */
  kind?: "signal" | "power"
  /** Arrowheads: from → to, both ends, or neither. Defaults to forward. */
  direction?: "forward" | "both" | "none"
}

export const systemBlockConnectionProps = z.object({
  name: z.string().trim().min(1).optional(),
  from: z.string().trim().min(1),
  to: z.string().trim().min(1),
  label: z.string().optional(),
  kind: z.enum(["signal", "power"]).default("signal"),
  direction: z.enum(["forward", "both", "none"]).default("forward"),
})

export type SystemBlockConnectionPropsInput = z.input<
  typeof systemBlockConnectionProps
>

expectTypesMatch<SystemBlockConnectionProps, SystemBlockConnectionPropsInput>(
  true,
)
