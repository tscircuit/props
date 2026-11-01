import { expect, test } from "bun:test"
import { createElement } from "react"
import {
  type AssemblyFaceMountProps,
  type AssemblyPartProps,
  type AssemblySubassemblyProps,
  assemblyCadAssemblyProps,
  assemblyMotorProps,
  assemblyFastenerProps,
  assemblyBoltProps,
  assemblyPartProps,
  assemblyPrintedPartProps,
  assemblySubassemblyProps,
} from "lib"

const jscad = createElement("cuboid", { size: [10, 20, 4] })
const validators = [
  assemblyPartProps,
  assemblySubassemblyProps,
  assemblyCadAssemblyProps,
  assemblyPrintedPartProps,
  assemblyMotorProps,
]
const base = { name: "RAIL", standard: "nema17", jscad }

test("parts, both subassembly aliases, printed parts and motors share face parsing", () => {
  const mount = {
    mountedTo: " BRIDGE.rail ",
    mountFace: " base ",
    mountGap: "0.1in",
  } satisfies AssemblyFaceMountProps
  for (const schema of validators) {
    const parsed = schema.parse({ ...base, ...mount })
    expect(parsed.mountedTo).toBe("BRIDGE.rail")
    expect(parsed.mountFace).toBe("base")
    expect(parsed.mountGap).toBe(2.54)
  }
})

test("every face-mounted element rejects unpaired faces and invalid gaps", () => {
  for (const schema of validators) {
    for (const mount of [
      { mountedTo: "BRIDGE.rail" },
      { mountFace: "base" },
      { mountedTo: "BRIDGE", mountFace: "base" },
      { mountedTo: "BRIDGE.", mountFace: "base" },
      { mountedTo: "BRIDGE.rail", mountFace: " " },
      { mountGap: 0 },
      { mountedTo: "BRIDGE.rail", mountFace: "base", mountGap: -0.1 },
      { mountedTo: "BRIDGE.rail", mountFace: "base", mountGap: Infinity },
      { mountedTo: "BRIDGE.rail", mountFace: "base", mountGap: "Infinitymm" },
      { mountedTo: "BRIDGE.rail", mountFace: "base", mountGap: "nonsense" },
    ]) {
      expect(schema.safeParse({ ...base, ...mount }).success).toBe(false)
    }
  }
})

test("face mounting competes with any explicit part or subassembly pose", () => {
  for (const schema of validators.slice(0, 4)) {
    for (const placement of [
      { cadPosition: { x: 0, y: 0, z: 0 } },
      { cadRotation: { x: 0, y: 0, z: "0deg" } },
    ]) {
      const result = schema.safeParse({
        ...base,
        mountedTo: "BRIDGE.rail",
        mountFace: "base",
        ...placement,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(
          result.error.issues.some((issue) => issue.path[0] === "mountedTo"),
        ).toBe(true)
      }
    }
  }
})

test("omission keeps existing unmounted values and motor orientation rules", () => {
  expect(assemblyPartProps.parse({ name: "RAIL" })).toEqual({ name: "RAIL" })
  expect(assemblySubassemblyProps.parse({ name: "BRIDGE" })).toEqual({
    name: "BRIDGE",
  })
  for (const schema of validators) {
    const parsed = schema.parse(base)
    expect(parsed.mountedTo).toBeUndefined()
    expect(parsed.mountFace).toBeUndefined()
    expect(parsed.mountGap).toBeUndefined()
    expect(
      schema.parse({
        ...base,
        mountedTo: "BRIDGE.rail",
        mountFace: "base",
        mountGap: 0,
      }).mountGap,
    ).toBe(0)
  }
  expect(assemblyMotorProps.parse(base).shaftFacingDirection).toBe("z+")
  expect(
    assemblyMotorProps.parse({
      ...base,
      mountedTo: "BRIDGE.rail",
      mountFace: "frontface",
    }).shaftFacingDirection,
  ).toBeUndefined()
  expect(
    assemblyMotorProps.safeParse({
      ...base,
      mountedTo: "BRIDGE.rail",
      mountFace: "frontface",
      shaftFacingDirection: "z+",
    }).success,
  ).toBe(false)
})

test("generic mounting preserves model alignment and named child surfaces", () => {
  const children = createElement("assembly.referencesurface", {
    name: "base",
    plane: "xz",
    normalDirection: "y+",
  })
  const input = {
    name: "RAIL",
    cadModel: { stepUrl: "./rail.step", positionOffset: { x: 2, y: 0, z: 0 } },
    children,
    mountedTo: "BRIDGE.rail",
    mountFace: "base",
  } satisfies AssemblyPartProps
  const parsed = assemblyPartProps.parse(input)
  expect(parsed.cadModel).toEqual(input.cadModel)
  expect(parsed.children).toBe(children)
  expect(parsed.mountGap).toBeUndefined()
  const container: AssemblySubassemblyProps = { ...input, name: "Z_MODULE" }
  expect(assemblyCadAssemblyProps.parse(container)).toEqual(
    assemblySubassemblyProps.parse(container),
  )
})

test("fasteners retain origin mounting and aliases without inheriting paired faces", () => {
  for (const schema of [assemblyFastenerProps, assemblyBoltProps]) {
    for (const target of [
      { mountedTo: "PLATE.hole" },
      { fastenedTo: "PLATE.hole" },
    ]) {
      const input = {
        name: "SCREW",
        model: "screw_m3_10mm",
        ...target,
        mountGap: "1mm",
      }
      const parsed = schema.parse(input)
      expect(parsed.mountedTo).toBe("PLATE.hole")
      expect(parsed.mountFace).toBeUndefined()
      expect(parsed.mountGap).toBe(1)
      for (const pose of [
        { cadPosition: { x: 0, y: 0, z: 0 } },
        { cadRotation: { x: 0, y: 0, z: 0 } },
      ]) {
        expect(schema.safeParse({ ...input, ...pose }).success).toBe(false)
      }
    }
  }
})
