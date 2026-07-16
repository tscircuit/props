import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface AssemblyDeviceProps {
  /** Product-level assembly identity. */
  name?: string
}

export const assemblyDeviceProps = z.object({
  name: z.string().optional(),
})

export type AssemblyDevicePropsInput = z.input<typeof assemblyDeviceProps>

expectTypesMatch<AssemblyDeviceProps, AssemblyDevicePropsInput>(true)
