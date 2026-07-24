import { z } from "zod"
import type { AutocompleteString } from "./common/autocomplete"
import { type CadModelProp, cadModelProp } from "./common/cadModel"
import { type PcbStyle, pcbStyle } from "./common/pcbStyle"
import { url } from "./common/url"
import {
  type AutorouterProp,
  type PartsEngine,
  autorouterProp,
  partsEngine,
} from "./components/group"
import { expectTypesMatch } from "./typecheck"

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

/** e.g. "kicad", this is the prefix used to reference libraries in footprinter strings e.g. kicad:Resistor_0402 **/
type FootprintLibraryPrefix = string

/** e.g. "kicad_mod", used to reference file extensions for loaders **/
type FileExtension = string

type FileContent = string | ArrayBufferLike

type EsModuleImportResult = {
  __esModule: true
  default: any
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

  unitPreference?: "mm" | "in" | "mil"

  pcbDisabled?: boolean
  routingDisabled?: boolean
  schematicDisabled?: boolean
  partsEngineDisabled?: boolean
  drcChecksDisabled?: boolean
  netlistDrcChecksDisabled?: boolean
  routingDrcChecksDisabled?: boolean
  placementDrcChecksDisabled?: boolean
  pinSpecificationDrcChecksDisabled?: boolean

  spiceEngineMap?: Record<string, SpiceEngine>

  footprintLibraryMap?: Record<
    FootprintLibraryPrefix,
    | ((
        path: string,
        options?: { resolvedPcbStyle?: PcbStyle },
      ) => Promise<FootprintLibraryResult>)
    | Record<
        string,
        | any[]
        | ((
            path: string,
            options?: { resolvedPcbStyle?: PcbStyle },
          ) => Promise<FootprintLibraryResult>)
      >
  >

  footprintFileParserMap?: Record<FileExtension, FootprintFileParserEntry>

  staticFileLoaderMap?: Record<
    FileExtension,
    (fileContent: FileContent) => Promise<EsModuleImportResult>
  >

  resolveProjectStaticFileImportUrl?: (path: string) => Promise<string>
  nodeModulesResolver?: (modulePath: string) => Promise<string | null>
  platformFetch?: typeof fetch
}

const unvalidatedCircuitJson = z.array(z.any()).describe("Circuit JSON")
const footprintLibraryResult = z.object({
  footprintCircuitJson: z.array(z.any()),
  cadModel: cadModelProp.optional(),
})

// Zod 4's z.function is a factory rather than a schema:
// https://zod.dev/v4/changelog#zfunction
const createValidatedAsyncFunctionSchema = <
  T extends (...args: any[]) => Promise<unknown>,
>(
  argsSchema: z.ZodTuple,
  outputSchema: z.ZodType,
) =>
  z
    .custom<T>((value): value is T => typeof value === "function")
    .transform((fn) => {
      const validatedFunction = async (...args: unknown[]) => {
        const parsedArgs = argsSchema.parse(args)
        const result = await (fn as (...args: unknown[]) => unknown)(
          ...parsedArgs,
        )

        return outputSchema.parse(result)
      }

      return validatedFunction as T
    })

const createValidatedFunctionSchema = <T extends (...args: any[]) => unknown>(
  argsSchema: z.ZodTuple,
  outputSchema: z.ZodType,
) =>
  z
    .custom<T>((value): value is T => typeof value === "function")
    .transform((fn) => {
      const validatedFunction = (...args: unknown[]) => {
        const parsedArgs = argsSchema.parse(args)
        const result = (fn as (...args: unknown[]) => unknown)(...parsedArgs)

        if (
          result !== null &&
          typeof result === "object" &&
          "then" in result &&
          typeof result.then === "function"
        ) {
          return Promise.resolve(result).then((value) =>
            outputSchema.parse(value),
          )
        }

        return outputSchema.parse(result)
      }

      return validatedFunction as T
    })

type PathToCircuitJsonFn = (
  path: string,
  options?: { resolvedPcbStyle?: PcbStyle },
) => Promise<FootprintLibraryResult>

const pathToCircuitJsonFn =
  createValidatedAsyncFunctionSchema<PathToCircuitJsonFn>(
    z.tuple([
      z.string(),
      z.object({ resolvedPcbStyle: pcbStyle.optional() }).optional(),
    ]),
    footprintLibraryResult,
  ).describe("A function that takes a path and returns Circuit JSON")

const footprintFileParserEntry = z.object({
  loadFromUrl: createValidatedAsyncFunctionSchema<
    FootprintFileParserEntry["loadFromUrl"]
  >(z.tuple([z.string()]), footprintLibraryResult).describe(
    "A function that takes a footprint file URL and returns Circuit JSON",
  ),
})

const spiceEngineSimulationResult = z.object({
  engineVersionString: z.string().optional(),
  simulationResultCircuitJson: unvalidatedCircuitJson,
})

const spiceEngineZod = z.object({
  simulate: createValidatedAsyncFunctionSchema<SpiceEngine["simulate"]>(
    z.tuple([z.string()]),
    spiceEngineSimulationResult,
  ).describe(
    "A function that takes a SPICE string and returns a simulation result",
  ),
})

const defaultSpiceEngine = z.custom<AutocompleteString<"spicey" | "ngspice">>(
  (value) => typeof value === "string",
)

const autorouterInstance = z.object({
  run: createValidatedAsyncFunctionSchema<AutorouterInstance["run"]>(
    z.tuple([]),
    z.unknown(),
  ).describe("Run the autorouter"),
  getOutputSimpleRouteJson: createValidatedAsyncFunctionSchema<
    AutorouterInstance["getOutputSimpleRouteJson"]
  >(z.tuple([]), z.unknown()).describe("Get the resulting SimpleRouteJson"),
})

const autorouterDefinition = z.object({
  createAutorouter: createValidatedFunctionSchema<
    AutorouterDefinition["createAutorouter"]
  >(z.tuple([z.any(), z.any().optional()]), autorouterInstance).describe(
    "Create an autorouter instance",
  ),
})

const platformFetch = z
  .custom<typeof fetch>((value) => typeof value === "function")
  .describe("A fetch-like function to use for platform requests")

export const platformConfig = z.object({
  partsEngine: partsEngine.optional(),
  autorouter: autorouterProp.optional(),
  autorouterMap: z.record(z.string(), autorouterDefinition).optional(),
  registryApiUrl: url.optional(),
  cloudAutorouterUrl: url.optional(),
  projectName: z.string().optional(),
  projectBaseUrl: url.optional(),
  version: z.string().optional(),
  url: url.optional(),
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
  unitPreference: z.enum(["mm", "in", "mil"]).optional(),
  localCacheEngine: z.any().optional(),
  pcbDisabled: z.boolean().optional(),
  routingDisabled: z.boolean().optional(),
  schematicDisabled: z.boolean().optional(),
  partsEngineDisabled: z.boolean().optional(),
  drcChecksDisabled: z.boolean().optional(),
  netlistDrcChecksDisabled: z.boolean().optional(),
  routingDrcChecksDisabled: z.boolean().optional(),
  placementDrcChecksDisabled: z.boolean().optional(),
  pinSpecificationDrcChecksDisabled: z.boolean().optional(),
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
  resolveProjectStaticFileImportUrl: createValidatedAsyncFunctionSchema<
    NonNullable<PlatformConfig["resolveProjectStaticFileImportUrl"]>
  >(z.tuple([z.string()]), z.string())
    .describe(
      "A function that returns a string URL for static files for the project",
    )
    .optional(),
  platformFetch: platformFetch.optional(),
}) as z.ZodType<PlatformConfig, PlatformConfig>

expectTypesMatch<PlatformConfig, z.infer<typeof platformConfig>>(true)
