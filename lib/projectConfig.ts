import { platformConfig, type PlatformConfig } from "./platformConfig"
import { expectTypesMatch } from "./typecheck"
import { z } from "zod"

export interface ProjectConfig
  extends Pick<
    PlatformConfig,
    | "projectName"
    | "projectBaseUrl"
    | "version"
    | "url"
    | "printBoardInformationToSilkscreen"
    | "includeBoardFiles"
  > {}

const platformConfigObject = platformConfig as z.ZodObject<any>

export const projectConfig = platformConfigObject.pick({
  projectName: true,
  projectBaseUrl: true,
  version: true,
  url: true,
  printBoardInformationToSilkscreen: true,
  includeBoardFiles: true,
}) as z.ZodType<ProjectConfig>

expectTypesMatch<ProjectConfig, z.infer<typeof projectConfig>>(true)
