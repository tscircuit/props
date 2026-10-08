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
    analogSimulationDisabled: true,
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
    analogSimulationDisabled: true,
  })
})

test("projectConfig includes disabled rendering flags when provided", () => {
  const config = projectConfig.parse({
    pcbDisabled: true,
    schematicDisabled: false,
    analogSimulationDisabled: true,
  })

  expect(config).toEqual({
    pcbDisabled: true,
    schematicDisabled: false,
    analogSimulationDisabled: true,
  })
})

test("projectConfig includes snapshotsDir when provided", () => {
  const config = projectConfig.parse({
    snapshotsDir: "tests/__snapshots__",
  })

  expect(config.snapshotsDir).toBe("tests/__snapshots__")
})

test("PCB style checking is an optional boolean preserved in platform and project configuration", async () => {
  const { platformConfig } = await import("../lib/platformConfig")
  for (const schema of [platformConfig, projectConfig]) {
    expect(schema.parse({}).pcbStyleChecksEnabled).toBeUndefined()
    expect(
      schema.parse({ pcbStyleChecksEnabled: false }).pcbStyleChecksEnabled,
    ).toBe(false)
    expect(
      schema.parse({ pcbStyleChecksEnabled: true }).pcbStyleChecksEnabled,
    ).toBe(true)
    expect(schema.safeParse({ pcbStyleChecksEnabled: "true" }).success).toBe(
      false,
    )
  }
})
