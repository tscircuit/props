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
}

export const platformConfig = z.object({
  partsEngine: partsEngine.optional(),
  autorouter: autorouterProp.optional(),
})

expectTypesMatch<PlatformConfig, z.infer<typeof platformConfig>>(true)
