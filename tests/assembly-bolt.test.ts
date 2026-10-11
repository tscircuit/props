import { expect, test } from "bun:test"
import {
  type AssemblyBoltProps,
  type AssemblyBoltPropsInput,
  assemblyBoltProps,
  assemblyProps,
} from "lib"

test("exports dimensional bolt props with parsed mm and a socket head default", () => {
  expect(assemblyProps.bolt).toBe(assemblyBoltProps)
  const input: AssemblyBoltProps = {
    name: "coverBolt",
    diameter: "3mm",
    length: "1cm",
    fastenedTo: "COVER.boltHole",
  }
  const props: AssemblyBoltPropsInput = input
  expect(assemblyBoltProps.parse(props)).toEqual({
    name: "coverBolt",
    diameter: 3,
    length: 10,
    headType: "socket",
    mountedTo: "COVER.boltHole",
  })
})

test("accepts every head type and optional thread pitch without inferring pitch", () => {
  for (const headType of ["socket", "hex", "pan", "countersunk"] as const) {
    expect(
      assemblyBoltProps.parse({
        name: "bolt",
        diameter: 3,
        length: 10,
        threadPitch: "0.5mm",
        headType,
      }),
    ).toEqual({
      name: "bolt",
      diameter: 3,
      length: 10,
      threadPitch: 0.5,
      headType,
    })
  }
  expect(
    assemblyBoltProps.parse({ name: "bolt", diameter: 3, length: 10 }),
  ).not.toHaveProperty("threadPitch")
})

test("accepts custom geometry without dimensional or head defaults", () => {
  for (const source of [
    { model: "bolt_m3_10mm" },
    { modelUrl: "bolt.step" },
    { cadModel: { stlUrl: "bolt.stl" } },
    { cadModel: null },
  ]) {
    expect(
      assemblyBoltProps.parse({
        name: "bolt",
        ...source,
        mountedTo: "FRAME.top",
      }),
    ).toEqual({ name: "bolt", ...source, mountedTo: "FRAME.top" })
    for (const dimension of [
      { diameter: 3 },
      { length: 10 },
      { threadPitch: 0.5 },
      { headType: "hex" },
    ]) {
      expect(
        assemblyBoltProps.safeParse({ name: "bolt", ...source, ...dimension })
          .success,
      ).toBe(false)
    }
  }
})

test("rejects incomplete dimensions and nonpositive or nonfinite lengths", () => {
  for (const input of [
    { name: "bolt" },
    { name: "bolt", diameter: 3 },
    { name: "bolt", length: 10 },
    { diameter: 3, length: 10 },
    { name: "bolt", diameter: 3, length: 10, headType: "unknown" },
  ]) {
    expect(assemblyBoltProps.safeParse(input).success).toBe(false)
  }
  for (const prop of ["diameter", "length", "threadPitch"] as const) {
    for (const value of [
      0,
      -1,
      "-1mm",
      "nonsense",
      Number.NaN,
      Number.POSITIVE_INFINITY,
    ]) {
      expect(
        assemblyBoltProps.safeParse({
          name: "bolt",
          diameter: 3,
          length: 10,
          [prop]: value,
        }).success,
      ).toBe(false)
    }
  }
})

test("inherits fastening and CAD source conflict checks", () => {
  for (const input of [
    { model: "bolt", cadModel: null },
    { model: "bolt", modelUrl: "bolt.step" },
    { model: "bolt", mountedTo: "FRAME.top", fastenedTo: "FRAME.bottom" },
    { diameter: 3, length: 10, mountGap: 1 },
  ]) {
    expect(
      assemblyBoltProps.safeParse({ name: "bolt", ...input }).success,
    ).toBe(false)
  }
})
