import { url } from "lib/common/url"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface AssemblyDeviceProps {
  /** Product-level assembly identity. */
  name?: string
  /** Imported CAD model URL. Mutually exclusive with cadModel where supported. */
  modelUrl?: string
}

export const assemblyDeviceProps = z.object({
  name: z.string().optional(),
  modelUrl: url
    .refine((value) => value.trim().length > 0, {
      message: "modelUrl cannot be empty",
    })
    .optional(),
})

export type AssemblyDevicePropsInput = z.input<typeof assemblyDeviceProps>

expectTypesMatch<AssemblyDeviceProps, AssemblyDevicePropsInput>(true)
