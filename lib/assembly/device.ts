import { url } from "lib/common/url"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface AssemblyDeviceProps {
  /** Product-level assembly identity. */
  name?: string
  /** Imported CAD model URL. Mutually exclusive with cadModel where supported. */
  modelUrl?: string
  /** Modelprinter/footprinter string, trimmed; mutually exclusive with other model sources. */
  model?: string
}

export const assemblyDeviceProps = z
  .object({
    name: z.string().optional(),
    model: z.string().trim().min(1).optional(),
    modelUrl: url
      .refine((value) => value.trim().length > 0, {
        message: "modelUrl cannot be empty",
      })
      .optional(),
  })
  .refine(
    (device) => device.model === undefined || device.modelUrl === undefined,
    {
      message: "Provide either model or modelUrl, not both",
      path: ["model"],
    },
  )

export type AssemblyDevicePropsInput = z.input<typeof assemblyDeviceProps>

expectTypesMatch<AssemblyDeviceProps, AssemblyDevicePropsInput>(true)
