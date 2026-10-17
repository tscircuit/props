import { z } from "zod"

const sha256 = z.string().regex(/^[a-f0-9]{64}$/i)
const ibisArchive = z
  .object({ member: z.string().min(1), memberSha256: sha256.optional() })
  .strict()

/** Remote hashes cover downloaded bytes; archive member hashes cover extracted bytes. */
export const ibisSource = z.union([
  z
    .object({ url: z.string().url(), sha256, archive: ibisArchive.optional() })
    .strict(),
  z
    .object({
      file: z.string().min(1),
      sha256: sha256.optional(),
      archive: ibisArchive.optional(),
    })
    .strict(),
  z.object({ content: z.string().min(1), sha256: sha256.optional() }).strict(),
])
export type IbisSource = z.input<typeof ibisSource>

/** Directions are explicit per experiment. Only outputs accept an enable state. */
export const ibisPinRunState = z.discriminatedUnion("mode", [
  z.object({ mode: z.literal("input") }).strict(),
  z.object({ mode: z.literal("output"), enabled: z.boolean() }).strict(),
])
export type IbisPinRunState = z.input<typeof ibisPinRunState>

/** References are pin labels on the same component, never inferred supply rails. */
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

export const ibisModelDefinition = z.object({
  source: ibisSource,
  component: z.string().min(1),
  pinMap: z
    .record(z.string().min(1), z.string().min(1))
    .refine((pins) => Object.keys(pins).length > 0),
  modelSelections: z.record(z.string().min(1), z.string().min(1)).optional(),
  references: z.record(z.string().min(1), ibisPinReferences).optional(),
  corner: z.enum(["typical", "minimum", "maximum"]),
  packagePolicy: z.enum(["vendor", "omit"]),
})
/** Vendor physical pins map to component port labels. Corner and package policy have no defaults. */
export type IbisModelDefinition = z.input<typeof ibisModelDefinition>
