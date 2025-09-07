import {
  autorouterProp,
  type AutorouterProp,
  type PartsEngine,
  partsEngine,
} from "./components/group"
import { expectTypesMatch } from "./typecheck"
import { z } from "zod"
import { type CadModelProp, cadModelProp } from "./common/cadModel"

export interface PlatformConfig {
  partsEngine?: PartsEngine

  autorouter?: AutorouterProp

  // TODO this follows a subset of the localStorage interface
  localCacheEngine?: any

  registryApiUrl?: string

  cloudAutorouterUrl?: string

  projectName?: string
  version?: string
  url?: string
  printBoardInformationToSilkscreen?: boolean

  pcbDisabled?: boolean
  schematicDisabled?: boolean
  partsEngineDisabled?: boolean

  footprintLibraryMap?: Record<
    string,
    | ((
        path: string,
      ) => Promise<{ footprintCircuitJson: any[]; cadModel?: CadModelProp }>)
    | Record<
        string,
        | any[]
        | ((path: string) => Promise<{
            footprintCircuitJson: any[]
            cadModel?: CadModelProp
          }>)
      >
  >
}

const unvalidatedCircuitJson = z.array(z.any()).describe("Circuit JSON")
const pathToCircuitJsonFn = z
  .function()
  .args(z.string())
  .returns(
    z.promise(
      z.object({
        footprintCircuitJson: z.array(z.any()),
        cadModel: cadModelProp.optional(),
      }),
    ),
  )
  .describe("A function that takes a path and returns Circuit JSON")

export const platformConfig = z.object({
  partsEngine: partsEngine.optional(),
  autorouter: autorouterProp.optional(),
  registryApiUrl: z.string().optional(),
  cloudAutorouterUrl: z.string().optional(),
  projectName: z.string().optional(),
  version: z.string().optional(),
  url: z.string().optional(),
  printBoardInformationToSilkscreen: z.boolean().optional(),
  localCacheEngine: z.any().optional(),
  pcbDisabled: z.boolean().optional(),
  schematicDisabled: z.boolean().optional(),
  partsEngineDisabled: z.boolean().optional(),
  footprintLibraryMap: z
    .record(
      z.string(),
      z.union([
        pathToCircuitJsonFn,
        z.record(
          z.string(),
          z.union([unvalidatedCircuitJson, pathToCircuitJsonFn]),
        ),
      ]),
    )
    .optional(),
}) as z.ZodType<PlatformConfig>

expectTypesMatch<PlatformConfig, z.infer<typeof platformConfig>>(true)
