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

test("parses signed in-plane offsets with target constraints, not absolute poses", () => {
  for (const schema of validators) {
    const input = {
      ...base,
      mountedTo: ".BRIDGE > .rail",
      mountFace: "base",
      mountOffset: { x: "-0.1in" },
      mountGap: "2mm",
    }
    expect(schema.parse(input).mountOffset).toEqual({ x: -2.54, y: 0 })
    expect(input.mountOffset).toEqual({ x: "-0.1in" })
    expect(
      schema.parse({ ...base, mountedTo: "BRIDGE.rail", mountFace: "base" })
        .mountOffset,
    ).toBeUndefined()
    for (const mountOffset of [{ x: Infinity }, { y: "nonsense" }, { z: 2 }]) {
      expect(schema.safeParse({ ...input, mountOffset }).success).toBe(false)
    }
    expect(schema.safeParse({ ...base, mountOffset: { x: 2 } }).success).toBe(
      false,
    )
  }
  for (const schema of [assemblyFastenerProps, assemblyBoltProps]) {
    expect(
      schema.parse({
        name: "BOLT",
        model: "screw_m3_10mm",
        fastenedTo: ".PLATE > .hole",
        mountOffset: { y: "5mm" },
      }).mountOffset,
    ).toEqual({ x: 0, y: 5 })
    expect(
      schema.safeParse({
        name: "BOLT",
        model: "screw_m3_10mm",
        mountOffset: { x: 1 },
      }).success,
    ).toBe(false)
  }
  const part: AssemblyPartProps = {
    name: "RAIL",
    // @ts-expect-error Absolute CAD placement is outside this contract.
    cadPosition: { x: 1, y: 2, z: 3 },
  }
  const group: AssemblySubassemblyProps = {
    name: "BRIDGE",
    // @ts-expect-error Orientation comes from face constraints.
    cadRotation: { x: 0, y: 0, z: 90 },
  }
  expect(part.name).toBe("RAIL")
  expect(group.name).toBe("BRIDGE")
})

test("preserves CSS references and leaves selector resolution to core", () => {
  for (const mountedTo of [
    ".BRIDGE > .rail",
    "[name='BRIDGE'] > [name='rail']",
    ".BRIDGE .rail",
    "BRIDGE.rail",
  ]) {
    for (const schema of validators) {
      expect(
        schema.parse({
          ...base,
          mountedTo: `  ${mountedTo}  `,
          mountFace: "base",
        }).mountedTo,
      ).toBe(mountedTo)
    }
    for (const schema of [assemblyFastenerProps, assemblyBoltProps]) {
      expect(
        schema.parse({
          name: "SCREW",
          model: "screw_m3_10mm",
          fastenedTo: `  ${mountedTo}  `,
        }).mountedTo,
      ).toBe(mountedTo)
    }
  }
})

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
      { mountedTo: "", mountFace: "base" },
      { mountedTo: " ", mountFace: "base" },
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
    }
  }
})
