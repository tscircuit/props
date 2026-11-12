import { signalBitRate, signalTimeOrUi } from "lib/common/signal-integrity"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export type SignalPin = string
export type SignalPair = { p: string; n: string }
export type SignalEndpoint =
  | SignalPin
  | SignalPair
  | { pin: SignalPin; model?: string }
  | { pin: SignalPair; model?: string | { p: string; n: string } }

const pin = z.string().trim().min(1)
const pair = z.object({ p: pin, n: pin }).strict()
export const signalEndpoint = z.union([
  pin,
  pair,
  z.object({ pin, model: pin.optional() }).strict(),
  z.object({ pin: pair, model: z.union([pin, pair]).optional() }).strict(),
])

export interface PcbChannelProps {
  /** Unique within the enclosing SI block. */
  name: string
  /** Driving pin: ".U1 > .A4", a pair { p, n }, or either as { pin, model } to choose the IBIS model (per leg for a pair). */
  driverRef: SignalEndpoint
  /** Arrays always mean multiple receivers; only { p, n } means a differential pair. Single-ended probes reference each driving/receiving chip's own ground pin. */
  receiverRef: SignalEndpoint | SignalEndpoint[]
  /** Overrides the block bit rate. Raw and parsed numbers are bit/s. */
  bitRate?: string | number
  /** Open pattern string. Default: prbs7. Examples: prbs15, prbs31, clock, or literal bits. Constant patterns "0" and "1" declare quiet signals. */
  pattern?: string
  /** Explicit PRBS seed: integer 1..2^n-1 for prbsN (including disabled drivers). Omitted seeds use phases spaced by sorted signal name across board blocks; core resolves them. Unused for other patterns. */
  seed?: number
  /** Delay in seconds or UI. Parsed times are seconds; UI remains a normalized string for core to resolve at the signal bit rate. Default: 0UI. */
  offset?: string | number
  /** Tri-state the driver (high impedance) so this line stays quiet and only picks up crosstalk; pattern is ignored. Unlike pattern "0", which actively drives low and absorbs coupled noise. Every driver leg's IBIS model must support a disable state. Default: false. */
  driverDisabled?: boolean
}

export const pcbChannelProps = z
  .object({
    name: z.string().trim().min(1),
    driverRef: signalEndpoint,
    receiverRef: z.union([signalEndpoint, z.array(signalEndpoint).min(1)]),
    bitRate: signalBitRate.optional(),
    pattern: z.string().trim().min(1).default("prbs7"),
    seed: z.number().int().min(1).optional(),
    offset: signalTimeOrUi.default("0UI"),
    driverDisabled: z.boolean().default(false),
  })
  .strict()
  .superRefine(({ name, pattern, seed }, ctx) => {
    if (seed === undefined || !["prbs7", "prbs15", "prbs31"].includes(pattern))
      return
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
expectTypesMatch<PcbChannelProps, z.input<typeof pcbChannelProps>>(true)
