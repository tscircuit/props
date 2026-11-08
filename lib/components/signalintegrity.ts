import { signalBitRate, signalTimeOrUi } from "lib/common/signalIntegrity"
import { expectTypesMatch } from "lib/typecheck"
import type { ReactNode } from "react"
import { z } from "zod"

/** One coupled SI test. Rendering and board-dependent diagnostics belong to core. */
export interface SignalIntegrityProps {
  /** Required when the board contains more than one SI block. */
  name?: string
  /** Default signal bit rate. Raw and parsed numbers are bit/s. */
  bitRate: string | number
  /** Time or UI at the block bit rate; parsed to seconds. Omitted duration is derived from the longest pattern plus 16 UI in core. */
  duration?: string | number
  corner?: "typ" | "min" | "max"
  unlistedNets?: "passive"
  unrouted?: "error" | "ideal"
  /** "ideal" (default): chip power/ground pins see perfect rails. "extracted" is not implemented yet. */
  pdn?: "extracted" | "ideal"
  supply?: "board" | "ibis"
  children?: ReactNode
}

export const signalIntegrityProps = z
  .object({
    name: z.string().min(1).optional(),
    bitRate: signalBitRate,
    duration: signalTimeOrUi
      .refine(
        (value) =>
          typeof value === "string" ? Number.parseFloat(value) > 0 : value > 0,
        "Duration must be positive",
      )
      .optional(),
    corner: z.enum(["typ", "min", "max"]).default("typ"),
    unlistedNets: z.literal("passive").default("passive"),
    unrouted: z.enum(["error", "ideal"]).default("error"),
    pdn: z.enum(["extracted", "ideal"]).default("ideal"),
    supply: z.enum(["board", "ibis"]).default("board"),
    children: z.custom<ReactNode>().optional(),
  })
  .strict()
  .transform(({ duration, ...props }) => ({
    ...props,
    ...(duration === undefined
      ? {}
      : {
          duration:
            typeof duration === "string"
              ? Number.parseFloat(duration) / props.bitRate
              : duration,
        }),
  }))

expectTypesMatch<SignalIntegrityProps, z.input<typeof signalIntegrityProps>>(
  true,
)
