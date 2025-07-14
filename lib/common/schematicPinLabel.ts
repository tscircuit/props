import { z } from "zod"

/**
 * Valid pin label string. Must consist only of letters,
 * numbers, or underscores.
 */
export const schematicPinLabel = z.string().regex(/^[A-Za-z0-9_]+$/)
export type SchematicPinLabel = z.infer<typeof schematicPinLabel>
