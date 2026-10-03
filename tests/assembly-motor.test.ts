import { expect, test } from "bun:test"
import {
  type AssemblyMotorProps,
  type AssemblyMotorPropsInput,
  assemblyMotorProps,
  assemblyProps,
} from "lib"

const nema17Model =
  "nema17_bodylength38mm_shaftlength24mm_flatdepth0.5mm_flatlength15mm"

test("assembly.motor registers its schema and preserves modelprinter usage", () => {
  expect(assemblyProps.motor).toBe(assemblyMotorProps)
  const props: AssemblyMotorProps = {
    name: "MOTOR",
    displayName: "NEMA17 stepper motor",
    model: `  ${nema17Model}  `,
    shaftFacingDirection: "z-",
  }
  const input: AssemblyMotorPropsInput = props
  expect(assemblyProps.motor.parse(input)).toEqual({
    ...input,
    model: nema17Model,
    shaftFacingDirection: "z-",
  })
  expect(input.model).toBe(`  ${nema17Model}  `)
})

test("accepts all six shaft directions without changing their axis or sign", () => {
  for (const shaftFacingDirection of [
    "x+",
    "x-",
    "y+",
    "y-",
    "z+",
    "z-",
  ] as const) {
    expect(
      assemblyMotorProps.parse({
        name: "MOTOR",
        model: nema17Model,
        shaftFacingDirection,
      }).shaftFacingDirection,
    ).toBe(shaftFacingDirection)
  }
})

test("defaults to the native positive Z shaft direction", () => {
  const input: AssemblyMotorPropsInput = { name: "MOTOR", model: "nema17" }
  expect(assemblyMotorProps.parse(input)).toEqual({
    ...input,
    shaftFacingDirection: "z+",
  })
  expect(input).toEqual({ name: "MOTOR", model: "nema17" })
})

test("selects each NEMA standard without requiring a modelprinter string", () => {
  for (const standard of ["nema8", "nema17", "nema23"] as const) {
    const input: AssemblyMotorPropsInput = {
      name: "MOTOR",
      standard,
      shaftFacingDirection: "x+",
    }
    expect(assemblyProps.motor.parse(input)).toEqual({
      name: "MOTOR",
      standard,
      shaftFacingDirection: "x+",
    })
  }
  expect(
    assemblyMotorProps.parse({ name: "MOTOR", standard: "nema17" }),
  ).toEqual({
    name: "MOTOR",
    standard: "nema17",
    shaftFacingDirection: "z+",
  })
})

test("rejects unsupported standards and competing model selections", () => {
  for (const standard of ["nema14", "NEMA17", "nema17 ", "", null, 17]) {
    expect(
      assemblyMotorProps.safeParse({ name: "MOTOR", standard }).success,
    ).toBe(false)
  }
  expect(() =>
    assemblyMotorProps.parse({
      name: "MOTOR",
      standard: "nema17",
      model: nema17Model,
    }),
  ).toThrow("Provide either standard or model, not both")
})

test("rejects missing motor identity or selection instead of choosing a motor", () => {
  for (const input of [
    {},
    { name: "MOTOR" },
    { model: "nema17" },
    { name: "", model: "nema17" },
    { name: "  ", model: "nema17" },
    { name: "MOTOR", model: "" },
    { name: "MOTOR", model: "  " },
    { name: "MOTOR", model: null },
    { name: "MOTOR", model: 17 },
    { name: "MOTOR", modelUrl: "https://example.com/motor.glb" },
    { name: "MOTOR", cadModel: { glbUrl: "/motor.glb" } },
  ]) {
    expect(assemblyMotorProps.safeParse(input).success).toBe(false)
  }
})

test("rejects invalid shaft directions and ambiguous direction aliases", () => {
  for (const shaftFacingDirection of [
    "x",
    "+x",
    "X+",
    "z",
    "z- ",
    "above",
    "below",
    "front",
    "back",
    "",
    null,
    90,
    { x: 1, y: 0, z: 0 },
  ]) {
    expect(
      assemblyMotorProps.safeParse({
        name: "MOTOR",
        model: "nema17",
        shaftFacingDirection,
      }).success,
    ).toBe(false)
  }
})
