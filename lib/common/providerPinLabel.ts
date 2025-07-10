import { z } from "zod"

/**
 * Valid provider pin label string. Must consist only of letters,
 * numbers, or underscores.
 */
export const providerPinLabel = z.string().regex(/^[A-Za-z0-9_]+$/)
export type ProviderPinLabel = z.infer<typeof providerPinLabel>
