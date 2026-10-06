import { expect, test } from "bun:test"
import {
  assemblyDeviceProps,
  assemblyScreenProps,
  assemblySubassemblyProps,
  assemblyCadAssemblyProps,
} from "lib"

test("assembly model URLs preserve URLs and imported asset defaults without adding defaults", () => {
  for (const schema of [
    assemblyDeviceProps,
    assemblyScreenProps,
    assemblySubassemblyProps,
    assemblyCadAssemblyProps,
  ]) {
    const identity = { name: "part", connectsTo: ".J1" }
    for (const modelUrl of [
      "/housing.GLB?version=2",
      "https://example.com/model#ext=step",
    ]) {
      expect(schema.parse({ ...identity, modelUrl }).modelUrl).toBe(modelUrl)
      expect(
        schema.parse({ ...identity, modelUrl: { default: modelUrl } }).modelUrl,
      ).toBe(modelUrl)
    }
    for (const modelUrl of ["", "  ", 123]) {
      expect(schema.safeParse({ ...identity, modelUrl }).success).toBe(false)
    }
  }
})

test("assembly model URLs conflict with cadModel and replace the default screen model", () => {
  for (const schema of [
    assemblyScreenProps,
    assemblySubassemblyProps,
    assemblyCadAssemblyProps,
  ]) {
    expect(
      schema.safeParse({
        name: "part",
        connectsTo: ".J1",
        modelUrl: "/part.glb",
        cadModel: "soic8",
      }).success,
    ).toBe(false)
  }
  expect(
    assemblyScreenProps.parse({
      name: "screen",
      connectsTo: ".J1",
      modelUrl: "/screen.glb",
    }),
  ).toEqual({ name: "screen", connectsTo: ".J1", modelUrl: "/screen.glb" })
  expect(
    assemblyScreenProps.safeParse({
      name: "screen",
      connectsTo: ".J1",
      modelUrl: "/screen.glb",
      width: 10,
    }).success,
  ).toBe(false)
  expect(
    assemblySubassemblyProps.safeParse({
      name: "part",
      modelUrl: "/part.glb",
      cadModel: null,
    }).success,
  ).toBe(false)
})
