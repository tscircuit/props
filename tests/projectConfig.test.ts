import { expect, test } from "bun:test"
import { projectConfig } from "lib/projectConfig"

test("projectConfig only includes project-specific fields", () => {
  const config = projectConfig.parse({
    projectName: "my project",
    projectBaseUrl: "https://example.com/",
    version: "1.2.3",
    url: "https://example.com/docs",
    printBoardInformationToSilkscreen: true,
    includeBoardFiles: ["boards/main.circuit.tsx"],
    pcbDisabled: true,
    schematicDisabled: true,
    partsEngineDisabled: true,
    footprintLibraryMap: {},
  })

  expect(config).toEqual({
    projectName: "my project",
    projectBaseUrl: "https://example.com/",
    version: "1.2.3",
    url: "https://example.com/docs",
    printBoardInformationToSilkscreen: true,
    includeBoardFiles: ["boards/main.circuit.tsx"],
  })
})
