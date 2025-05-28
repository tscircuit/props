import {
  autorouterProp,
  type AutorouterProp,
  type PartsEngine,
  partsEngine,
} from "./components/group"
import { expectTypesMatch } from "./typecheck"
import { z } from "zod"

export interface PlatformConfig {
  partsEngine?: PartsEngine

  autorouter?: AutorouterProp

  registryApiUrl?: string

  cloudAutorouterUrl?: string

  footprintLibraryMap?: Record<string, Record<string, any[]>>
}

export const platformConfig = z.object({
  partsEngine: partsEngine.optional(),
  autorouter: autorouterProp.optional(),
  registryApiUrl: z.string().optional(),
  cloudAutorouterUrl: z.string().optional(),

  footprintLibraryMap: z
    .record(z.string(), z.record(z.string(), z.any().array()))
    .optional(),
})

expectTypesMatch<PlatformConfig, z.infer<typeof platformConfig>>(true)
