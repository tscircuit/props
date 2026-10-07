import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export type AssemblyCableStandard = "usb_c"

export interface AssemblyCableProps {
  /** Stable assembly identity for the cable. */
  name: string
  /** Start connector selector or named assembly reference, e.g. MOTOR.wireside. */
  from: string
  /** End connector selector or named assembly reference. */
  to: string
  /** Optional USB-C-to-USB-C preset. Omit to infer the cable from its endpoints. */
  standard?: AssemblyCableStandard
  /** Explicit cable model specification. Omit to infer the cable from its endpoints. */
  model?: string
}

export const assemblyCableProps = z.object({
  name: z.string().trim().min(1),
  from: z.string().trim().min(1),
  to: z.string().trim().min(1),
  standard: z.literal("usb_c").optional(),
  model: z.string().trim().min(1).optional(),
})

export type AssemblyCablePropsInput = z.input<typeof assemblyCableProps>

expectTypesMatch<AssemblyCableProps, AssemblyCablePropsInput>(true)
