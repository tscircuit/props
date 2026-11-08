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
  | { pin: SignalPin; model?: string }
  | { pin: SignalPair; model?: string | { p: string; n: string } }

const pin = z.string().min(1)
const pair = z.object({ p: pin, n: pin }).strict()
export const signalEndpoint = z.union([
  pin,
  pair,
  z.object({ pin, model: pin.optional() }).strict(),
  z.object({ pin: pair, model: z.union([pin, pair]).optional() }).strict(),
])

export interface SignalMask {
  /** Finite, signed volts; overrides the IBIS receiver threshold at the test corner. */
  vih?: string | number
  vil?: string | number
  /** Nonnegative seconds, including zero. setup/hold need a strobe; core checks this diagnostic. */
  setup?: string | number
  hold?: string | number
}

export const signalMask = z
  .object({
    vih: signalVoltage.optional(),
    vil: signalVoltage.optional(),
    setup: signalTime.pipe(z.number().nonnegative()).optional(),
    hold: signalTime.pipe(z.number().nonnegative()).optional(),
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
  /** Explicit PRBS seed: integer 1..2^n-1 for prbsN (including quiet PRBS). Omitted seeds use phases spaced by sorted signal name across board blocks; core resolves them. Unused for clock/literal drives. */
  seed?: number
  /** Delay in seconds or UI. Parsed times are seconds; UI remains a normalized string for core to resolve at the signal bit rate. Default: 0UI. */
  offset?: string | number
  quiet?: "low" | "high" | "off"
  probe?: "local" | "global"
  /** Defaults to ibis. setup/hold overrides need strobe. */
  mask?: "ibis" | SignalMask
  /** Name of a different switching signal in the same block, with a receiver on the same chip; resolved by core. */
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
    seed: z.number().finite().int().positive().optional(),
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
  .superRefine(({ name, pattern, seed }, ctx) => {
    if (seed === undefined || !pattern.startsWith("prbs")) return
    const max = 2 ** Number(pattern.slice(4)) - 1
    if (seed > max) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["seed"],
        message: `Signal "${name}": ${pattern} seed must be an integer in 1..${max}.`,
      })
    }
  })

expectTypesMatch<SignalEndpoint, z.input<typeof signalEndpoint>>(true)
expectTypesMatch<SignalMask, z.input<typeof signalMask>>(true)
expectTypesMatch<SignalProps, z.input<typeof signalProps>>(true)
