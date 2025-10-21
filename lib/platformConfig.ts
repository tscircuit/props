import {
  autorouterProp,
  type AutorouterProp,
  type PartsEngine,
  partsEngine,
} from "./components/group"
import type { AutocompleteString } from "./common/autocomplete"
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

export type CircuitJson = any[]

export interface SpiceEngineSimulationResult {
  engineVersionString?: string
  simulationResultCircuitJson: CircuitJson
}

export interface SpiceEngine {
  simulate: (spiceString: string) => Promise<SpiceEngineSimulationResult>
}

export type SimpleRouteJson = any

export interface AutorouterInstance {
  run: () => Promise<void>
  getOutputSimpleRouteJson: () => Promise<SimpleRouteJson>
}

export interface AutorouterDefinition {
  createAutorouter: (
    simpleRouteJson: SimpleRouteJson,
    opts?: Record<string, unknown>,
  ) => AutorouterInstance | Promise<AutorouterInstance>
}

export interface PlatformConfig {
  partsEngine?: PartsEngine

  autorouter?: AutorouterProp

  autorouterMap?: Record<string, AutorouterDefinition>

  // TODO this follows a subset of the localStorage interface
  localCacheEngine?: any

  registryApiUrl?: string

  cloudAutorouterUrl?: string

  projectName?: string
  projectBaseUrl?: string
  version?: string
  url?: string
  printBoardInformationToSilkscreen?: boolean
  includeBoardFiles?: string[]
  snapshotsDir?: string

  defaultSpiceEngine?: AutocompleteString<"spicey" | "ngspice">

  pcbDisabled?: boolean
  schematicDisabled?: boolean
  partsEngineDisabled?: boolean

  spiceEngineMap?: Record<string, SpiceEngine>

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

const spiceEngineSimulationResult = z.object({
  engineVersionString: z.string().optional(),
  simulationResultCircuitJson: unvalidatedCircuitJson,
})

const spiceEngineZod = z.object({
  simulate: z
    .function()
    .args(z.string())
    .returns(z.promise(spiceEngineSimulationResult))
    .describe(
      "A function that takes a SPICE string and returns a simulation result",
    ),
})

const defaultSpiceEngine = z.custom<AutocompleteString<"spicey" | "ngspice">>(
  (value) => typeof value === "string",
)

const autorouterInstance = z.object({
  run: z
    .function()
    .args()
    .returns(z.promise(z.unknown()))
    .describe("Run the autorouter"),
  getOutputSimpleRouteJson: z
    .function()
    .args()
    .returns(z.promise(z.any()))
    .describe("Get the resulting SimpleRouteJson"),
})

const autorouterDefinition = z.object({
  createAutorouter: z
    .function()
    .args(z.any(), z.any().optional())
    .returns(z.union([autorouterInstance, z.promise(autorouterInstance)]))
    .describe("Create an autorouter instance"),
})

export const platformConfig = z.object({
  partsEngine: partsEngine.optional(),
  autorouter: autorouterProp.optional(),
  autorouterMap: z.record(z.string(), autorouterDefinition).optional(),
  registryApiUrl: z.string().optional(),
  cloudAutorouterUrl: z.string().optional(),
  projectName: z.string().optional(),
  projectBaseUrl: z.string().optional(),
  version: z.string().optional(),
  url: z.string().optional(),
  printBoardInformationToSilkscreen: z.boolean().optional(),
  includeBoardFiles: z
    .array(z.string())
    .describe(
      'The board files to automatically build with "tsci build", defaults to ["**/*.circuit.tsx"]. Can be an array of files or globs',
    )
    .optional(),
  snapshotsDir: z
    .string()
    .describe(
      'The directory where snapshots are stored for "tsci snapshot", defaults to "tests/__snapshots__"',
    )
    .optional(),
  defaultSpiceEngine: defaultSpiceEngine.optional(),
  localCacheEngine: z.any().optional(),
  pcbDisabled: z.boolean().optional(),
  schematicDisabled: z.boolean().optional(),
  partsEngineDisabled: z.boolean().optional(),
  spiceEngineMap: z.record(z.string(), spiceEngineZod).optional(),
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
