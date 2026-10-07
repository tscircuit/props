import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export type AssemblyCableStandard = "usb_c" | "adaptercable"

export interface AssemblyCableProps {
  /** Stable assembly identity for the cable. */
  name: string
  /** Start connector selector or named assembly reference, e.g. MOTOR.wireside. */
  from: string
  /** End connector selector or named assembly reference. */
  to: string
  /** Optional cable standard. adaptercable composes independent ends; omit to
   * infer an adapter or an existing same-end preset from the endpoints.
   */
  standard?: AssemblyCableStandard
}

export const assemblyCableProps = z.object({
  name: z.string().trim().min(1),
  from: z.string().trim().min(1),
  to: z.string().trim().min(1),
  standard: z.enum(["usb_c", "adaptercable"]).optional(),
})

export type AssemblyCablePropsInput = z.input<typeof assemblyCableProps>

expectTypesMatch<AssemblyCableProps, AssemblyCablePropsInput>(true)
