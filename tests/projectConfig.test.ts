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
    snapshotsDir: "custom/snapshots",
    defaultSpiceEngine: "spicey",
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
    snapshotsDir: "custom/snapshots",
    defaultSpiceEngine: "spicey",
    pcbDisabled: true,
    schematicDisabled: true,
  })
})

test("projectConfig includes disabled rendering flags when provided", () => {
  const config = projectConfig.parse({
    pcbDisabled: true,
    schematicDisabled: false,
  })

  expect(config).toEqual({
    pcbDisabled: true,
    schematicDisabled: false,
  })
})

test("projectConfig includes snapshotsDir when provided", () => {
  const config = projectConfig.parse({
    snapshotsDir: "tests/__snapshots__",
  })

  expect(config.snapshotsDir).toBe("tests/__snapshots__")
})
