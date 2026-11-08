import {
  signalBitRate,
  signalTime,
  signalTimeOrUi,
  signalVoltage,
} from "lib/common/signalIntegrity"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export type SignalPin = string
export type SignalPair = { p: string; n: string }
export type SignalEndpoint =
  | SignalPin
  | SignalPair
  | { pin: SignalPin | SignalPair; model?: string }

const pin = z.string().min(1)
const pair = z.object({ p: pin, n: pin }).strict()
export const signalEndpoint = z.union([
  pin,
  pair,
  z
    .object({ pin: z.union([pin, pair]), model: z.string().min(1).optional() })
    .strict(),
])

export interface SignalMask {
  /** Raw and parsed voltages are volts. Overrides the IBIS receiver threshold. */
  vih?: string | number
  vil?: string | number
  /** Raw and parsed times are seconds. setup/hold need a strobe; core checks this diagnostic. */
  setup?: string | number
  hold?: string | number
}

export const signalMask = z
  .object({
    vih: signalVoltage.optional(),
    vil: signalVoltage.optional(),
    setup: signalTime.optional(),
    hold: signalTime.optional(),
  })
  .strict()

export interface SignalProps {
  /** Unique within the enclosing SI block. */
  name: string
  driver: SignalEndpoint
  /** Arrays always mean multiple receivers; only { p, n } means a differential pair. */
  receiver: SignalEndpoint | SignalEndpoint[]
  /** Overrides the block bit rate. Raw and parsed numbers are bit/s. */
  bitRate?: string | number
  /** prbs7 (default), prbs15, prbs31, clock, or a nonempty literal bit string. */
  pattern?: string
  /** Omitted seeds are derived from the signal name by core. */
  seed?: number
  /** Delay in seconds or UI. Parsed times are seconds; UI remains a normalized string for core to resolve at the signal bit rate. Default: 0UI. */
  offset?: string | number
  quiet?: "low" | "high" | "off"
  probe?: "local" | "global"
  /** Defaults to ibis. setup/hold overrides need strobe. */
  mask?: "ibis" | SignalMask
  /** Name of the sampling signal in the same block; resolved by core. */
  strobe?: string
}

export const signalProps = z
  .object({
    name: z.string().min(1),
    driver: signalEndpoint,
    receiver: z.union([signalEndpoint, z.array(signalEndpoint).min(1)]),
    bitRate: signalBitRate.optional(),
    pattern: z
      .string()
      .regex(
        /^(?:prbs7|prbs15|prbs31|clock|[01]+)$/,
        "Expected prbs7, prbs15, prbs31, clock, or a literal bit string",
      )
      .default("prbs7"),
    seed: z.number().finite().optional(),
    offset: signalTimeOrUi.default("0UI"),
    quiet: z
      .enum(["low", "high", "off"], {
        errorMap: () => ({
          message: 'quiet needs a level: "low", "high" or "off".',
        }),
      })
      .optional(),
    probe: z.enum(["local", "global"]).default("local"),
    mask: z.union([z.literal("ibis"), signalMask]).default("ibis"),
    strobe: z.string().min(1).optional(),
  })
  .strict()

expectTypesMatch<SignalEndpoint, z.input<typeof signalEndpoint>>(true)
expectTypesMatch<SignalMask, z.input<typeof signalMask>>(true)
expectTypesMatch<SignalProps, z.input<typeof signalProps>>(true)
