import { expect, test } from "bun:test"
import { createElement } from "react"
import {
  type AssemblyPartProps,
  type AssemblyPrintedPartProps,
  type AssemblySubassemblyProps,
  assemblyCadAssemblyProps,
  assemblyPartProps,
  assemblyPlacementProps,
  assemblyPrintedPartProps,
  assemblySubassemblyProps,
} from "lib"

const jscad = createElement("cuboid", { size: [10, 20, 4] })
const schemas = [
  assemblyPartProps,
  assemblySubassemblyProps,
  assemblyCadAssemblyProps,
  assemblyPrintedPartProps,
]

test("assembly placement parses unit-bearing local points and Euler angles", () => {
  const placement = {
    cadPosition: { x: "1in", y: "-20mm", z: 3 },
    cadRotation: { x: "1.5707963267948966rad", y: 0, z: "-90deg" },
  }
  for (const schema of schemas) {
    const parsed = schema.parse({ name: "CARRIAGE", jscad, ...placement })
    expect(parsed.cadPosition).toEqual({ x: 25.4, y: -20, z: 3 })
    expect(parsed.cadRotation).toEqual({ x: 90, y: 0, z: -90 })
  }
})

test("placement omission preserves legacy parsed shapes and children", () => {
  expect(assemblyPlacementProps.parse({})).toEqual({})
  const child = createElement("assembly.part", { name: "BEARING" })
  expect(
    assemblySubassemblyProps.parse({ name: "BRIDGE", children: child }),
  ).toEqual({ name: "BRIDGE", children: child })
  expect(assemblyPartProps.parse({ name: "RAIL" })).toEqual({ name: "RAIL" })
  expect(assemblyPrintedPartProps.parse({ name: "CLAMP", jscad })).toEqual({
    name: "CLAMP",
    jscad,
  })
})

test("placement rejects incomplete points, malformed units and nonfinite values", () => {
  for (const schema of schemas) {
    for (const placement of [
      { cadPosition: { x: 1, y: 2 } },
      { cadPosition: { x: Infinity, y: 0, z: 0 } },
      { cadPosition: { x: "nonsense", y: 0, z: 0 } },
      { cadRotation: { x: 0, y: 90 } },
      { cadRotation: { x: NaN, y: 0, z: 0 } },
      { cadRotation: { x: "90junk", y: 0, z: 0 } },
      { cadRotation: { x: "90degcw", y: 0, z: 0 } },
      { cadRotation: { x: "Infinityrad", y: 0, z: 0 } },
    ]) {
      expect(
        schema.safeParse({ name: "PART", jscad, ...placement }).success,
      ).toBe(false)
    }
  }
})

test("model alignment remains separate from assembly placement", () => {
  const input = {
    name: "MOUNT",
    cadPosition: { x: "100mm", y: 0, z: 0 },
    cadModel: {
      stepUrl: "./mount.step",
      positionOffset: { x: 5, y: 0, z: 0 },
      rotationOffset: { x: 0, y: 0, z: 90 },
    },
  } satisfies AssemblyPartProps
  const parsed = assemblyPartProps.parse(input)
  expect(parsed.cadPosition).toEqual({ x: 100, y: 0, z: 0 })
  expect(parsed.cadModel).toEqual(input.cadModel)
})

test("face-mounted printed parts reject a second explicit pose, including zero", () => {
  const mount = {
    name: "CLAMP",
    jscad,
    mountedTo: "PLATE.tool",
    mountFace: "plate",
  }
  expect(assemblyPrintedPartProps.safeParse(mount).success).toBe(true)
  for (const placement of [
    { cadPosition: { x: 0, y: 0, z: 0 } },
    { cadRotation: { x: 0, y: 0, z: 0 } },
  ]) {
    expect(
      assemblyPrintedPartProps.safeParse({ ...mount, ...placement }).success,
    ).toBe(false)
  }
})

test("public assembly interfaces expose the same local-placement contract", () => {
  const part: AssemblyPartProps = {
    name: "RAIL",
    cadPosition: { x: 5, y: 0, z: 0 },
  }
  const subassembly: AssemblySubassemblyProps = {
    name: "BRIDGE",
    cadRotation: { x: 0, y: 0, z: "90deg" },
  }
  const printed: AssemblyPrintedPartProps = {
    name: "CLAMP",
    jscad,
    cadPosition: { x: 0, y: 0, z: "2mm" },
  }
  expect(assemblyPartProps.parse(part).cadPosition?.x).toBe(5)
  expect(assemblySubassemblyProps.parse(subassembly).cadRotation?.z).toBe(90)
  expect(assemblyPrintedPartProps.parse(printed).cadPosition?.z).toBe(2)
})
