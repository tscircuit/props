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
    | "includeBoards"
  > {}

const platformConfigObject = platformConfig as z.ZodObject<any>

export const projectConfig = platformConfigObject.pick({
  projectName: true,
  projectBaseUrl: true,
  version: true,
  url: true,
  printBoardInformationToSilkscreen: true,
  includeBoards: true,
}) as z.ZodType<ProjectConfig>

expectTypesMatch<ProjectConfig, z.infer<typeof projectConfig>>(true)
