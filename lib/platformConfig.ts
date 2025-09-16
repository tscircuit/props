import {
  autorouterProp,
  type AutorouterProp,
  type PartsEngine,
  partsEngine,
} from "./components/group"
import { expectTypesMatch } from "./typecheck"
import { z } from "zod"
import { type CadModelProp, cadModelProp } from "./common/cadModel"

export interface FootprintLibraryResult {
  footprintCircuitJson: any[]
  cadModel?: CadModelProp
}

export interface FootprintFileParserEntry {
  loadFromUrl: (url: string) => Promise<FootprintLibraryResult>
}

export interface PlatformConfig {
  partsEngine?: PartsEngine

  autorouter?: AutorouterProp

  // TODO this follows a subset of the localStorage interface
  localCacheEngine?: any

  registryApiUrl?: string

  cloudAutorouterUrl?: string

  projectName?: string
  projectBaseUrl?: string
  version?: string
  url?: string
  printBoardInformationToSilkscreen?: boolean

  pcbDisabled?: boolean
  schematicDisabled?: boolean
  partsEngineDisabled?: boolean

  footprintLibraryMap?: Record<
    string,
    | ((path: string) => Promise<FootprintLibraryResult>)
    | Record<
        string,
        any[] | ((path: string) => Promise<FootprintLibraryResult>)
      >
  >

  footprintFileParserMap?: Record<string, FootprintFileParserEntry>
}

const unvalidatedCircuitJson = z.array(z.any()).describe("Circuit JSON")
const footprintLibraryResult = z.object({
  footprintCircuitJson: z.array(z.any()),
  cadModel: cadModelProp.optional(),
})
const pathToCircuitJsonFn = z
  .function()
  .args(z.string())
  .returns(z.promise(footprintLibraryResult))
  .describe("A function that takes a path and returns Circuit JSON")

const footprintFileParserEntry = z.object({
  loadFromUrl: z
    .function()
    .args(z.string())
    .returns(z.promise(footprintLibraryResult))
    .describe(
      "A function that takes a footprint file URL and returns Circuit JSON",
    ),
})

export const platformConfig = z.object({
  partsEngine: partsEngine.optional(),
  autorouter: autorouterProp.optional(),
  registryApiUrl: z.string().optional(),
  cloudAutorouterUrl: z.string().optional(),
  projectName: z.string().optional(),
  projectBaseUrl: z.string().optional(),
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
  footprintFileParserMap: z
    .record(z.string(), footprintFileParserEntry)
    .optional(),
}) as z.ZodType<PlatformConfig>

expectTypesMatch<PlatformConfig, z.infer<typeof platformConfig>>(true)
