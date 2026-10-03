import { expect, test } from "bun:test"
import {
  assemblyPrintedPartProps,
  assemblyProps,
  type AssemblyPrintedPartProps,
} from "../lib"

const Geometry = () => null
const jscad = <Geometry />

test("printedpart preserves JSX and parses paired face mounting and distances", () => {
  const input: AssemblyPrintedPartProps = {
    name: "SPACER",
    jscad,
    mountedTo: "MOTOR.backface",
    mountFace: "motor",
    mountGap: "2mm",
  }
  expect(assemblyProps.printedpart).toBe(assemblyPrintedPartProps)
  expect(assemblyPrintedPartProps.parse(input)).toEqual({
    ...input,
    mountGap: 2,
  })
  expect(assemblyPrintedPartProps.parse(input).jscad).toBe(jscad)
  expect(
    assemblyPrintedPartProps.parse({ name: "FREE", jscad }).mountGap,
  ).toBeUndefined()
  for (const extra of [
    { jscad: null },
    { jscad: {} },
    { name: " " },
    { mountedTo: "MOTOR" },
    { mountedTo: "MOTOR.backface" },
    { mountFace: "motor" },
    { mountGap: 1 },
    { mountedTo: "MOTOR.backface", mountFace: "motor", mountGap: -1 },
    { mountedTo: "MOTOR.backface", mountFace: "motor", mountGap: Infinity },
  ]) {
    expect(
      assemblyPrintedPartProps.safeParse({ name: "SPACER", jscad, ...extra })
        .success,
    ).toBe(false)
  }
})

test("printedpart accepts each existing model source and rejects conflicting sources", () => {
  const sources: Partial<AssemblyPrintedPartProps>[] = [
    { jscad },
    { model: "nema17" },
    { model: "https://example.com/part.glb" },
    { modelUrl: "./part.stl" },
    {
      cadModel: {
        glbUrl: "./part.glb",
        positionOffset: { x: "2mm", y: 0, z: 0 },
      },
    },
    { cadModel: { jscad: { type: "cuboid", size: [10, 20, 4] } } },
    { cadModel: <Geometry /> },
    { cadModel: null },
  ]
  for (const source of sources) {
    expect(
      assemblyPrintedPartProps.safeParse({ name: "PART", ...source }).success,
    ).toBe(true)
  }
  for (const source of [{}, { model: " " }, { modelUrl: "" }]) {
    expect(
      assemblyPrintedPartProps.safeParse({ name: "PART", ...source }).success,
    ).toBe(false)
  }
  const alternatives = [sources[0]!, sources[1]!, sources[3]!, sources[4]!]
  for (let i = 0; i < alternatives.length; i++) {
    for (let j = i + 1; j < alternatives.length; j++) {
      expect(
        assemblyPrintedPartProps.safeParse({
          name: "PART",
          ...alternatives[i],
          ...alternatives[j],
        }).success,
      ).toBe(false)
    }
  }
})
