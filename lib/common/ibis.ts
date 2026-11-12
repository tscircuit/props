import { asset } from "circuit-json"
import { z } from "zod"

/** Reference values are labels on the same chip, never inferred supply rails. */
export const ibisPinReferences = z
  .object({
    pullup: z.string().min(1).optional(),
    pulldown: z.string().min(1).optional(),
    powerClamp: z.string().min(1).optional(),
    groundClamp: z.string().min(1).optional(),
    external: z.string().min(1).optional(),
  })
  .strict()
export type IbisPinReferences = z.input<typeof ibisPinReferences>

/** Same location rules as circuit-json's simulation_ibis_model asset. */
const ibisAssetPath = z
  .string()
  .min(1)
  .regex(/^(?!\s|[a-z][a-z\d+.-]*:|[/\\])[^\\\u0000-\u001f\u007f]+$/i)

export const ibisModelAsset = asset.extend({
  project_relative_path: ibisAssetPath,
  url: z
    .string()
    .url()
    .regex(/^https?:\/\//i)
    .or(ibisAssetPath),
})

export const ibisModelDefinition = z.object({
  ibisModelAsset,
  ibisComponentName: z.string().min(1),
  ibisPinNameToPortLabel: z
    .record(z.string().min(1), z.string().min(1))
    .refine((pins) => Object.keys(pins).length > 0),
  ibisPinNameToModelName: z
    .record(z.string().min(1), z.string().min(1))
    .optional(),
  ibisPinNameToReferencePortLabels: z
    .record(z.string().min(1), ibisPinReferences)
    .optional(),
})
/** Vendor [Component] and [Pin] names are bound explicitly to this chip's ports. SI uses the typical corner and always simulates package parasitics. */
export type IbisModelDefinition = z.input<typeof ibisModelDefinition>
