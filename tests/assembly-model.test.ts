import { expect, test } from "bun:test"
import {
  assemblyDeviceProps,
  assemblyScreenProps,
  assemblySubassemblyProps,
  assemblyCadAssemblyProps,
} from "lib"

test("assembly model strings are trimmed and preserved for all elements", () => {
  for (const schema of [
    assemblyDeviceProps,
    assemblyScreenProps,
    assemblySubassemblyProps,
    assemblyCadAssemblyProps,
  ]) {
    for (const model of [
      "soic8",
      "flexscreen_w26.7mm_h19.26mm",
      "pinrow4_p2.54mm",
    ]) {
      const parsed = schema.parse({
        name: "part",
        connectsTo: ".J1",
        model: `  ${model}  `,
      })
      expect(parsed.model).toBe(model)
      expect(parsed.modelUrl).toBeUndefined()
    }
    for (const model of ["", "  ", null, 12, {}]) {
      expect(
        schema.safeParse({ name: "part", connectsTo: ".J1", model }).success,
      ).toBe(false)
    }
    expect(
      schema.safeParse({
        name: "part",
        connectsTo: ".J1",
        model: "soic8",
        modelUrl: "/part.glb",
      }).success,
    ).toBe(false)
  }
})

test("model conflicts with cadModel and preserves screen dimension validation", () => {
  for (const schema of [
    assemblyScreenProps,
    assemblySubassemblyProps,
    assemblyCadAssemblyProps,
  ]) {
    for (const cadModel of ["soic8", { glbUrl: "/part.glb" }, null]) {
      expect(
        schema.safeParse({
          name: "part",
          connectsTo: ".J1",
          model: "soic8",
          cadModel,
        }).success,
      ).toBe(false)
    }
  }
  expect(
    assemblyScreenProps.parse({
      name: "screen",
      connectsTo: ".J1",
      model: "flexscreen_w20_h10",
    }).model,
  ).toBe("flexscreen_w20_h10")
  for (const dimensions of [
    { width: 20 },
    { height: 10 },
    { width: -1, height: 10 },
  ]) {
    expect(
      assemblyScreenProps.safeParse({
        name: "screen",
        connectsTo: ".J1",
        model: "flexscreen_w20_h10",
        ...dimensions,
      }).success,
    ).toBe(false)
  }
  expect(
    assemblyScreenProps.parse({
      name: "screen",
      connectsTo: ".J1",
      model: "flexscreen_w20_h10",
      width: 20,
      height: 10,
    }).model,
  ).toBe("flexscreen_w20_h10")
})
