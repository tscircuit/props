import { expect, test } from "bun:test"
import {
  type AssemblyMotorProps,
  type AssemblyMotorPropsInput,
  assemblyMotorProps,
} from "lib"

const mounting = { mountedTo: "FRAME.xMotor", mountFace: "frontface" }

test("motor mounting preserves typed face references and parses clearance to mm", () => {
  const props: AssemblyMotorProps = {
    name: "X_MOTOR",
    standard: "nema17",
    mountedTo: "  FRAME.xMotor  ",
    mountFace: "  frontface  ",
    mountGap: "0.2cm",
  }
  const input: AssemblyMotorPropsInput = props
  expect(assemblyMotorProps.parse(input)).toEqual({
    name: "X_MOTOR",
    standard: "nema17",
    ...mounting,
    mountGap: 2,
  })
  expect(input.mountedTo).toBe("  FRAME.xMotor  ")
})

test("mounts each NEMA standard or a custom model without a default shaft direction", () => {
  for (const selection of [
    { standard: "nema8" },
    { standard: "nema17", wireConnection: "stubs" },
    { standard: "nema23" },
    { model: "nema17_bodylength38mm_shaftlength24mm" },
  ] as const) {
    for (const mountFace of ["frontface", "backface", "customFace"]) {
      const input = { name: "MOTOR", ...selection, ...mounting, mountFace }
      const output = assemblyMotorProps.parse(input)
      expect(output).toEqual(input)
      expect(output.shaftFacingDirection).toBeUndefined()
      expect(output.mountGap).toBeUndefined()
    }
  }
})

test("mounting accepts zero clearance and positive numeric millimeters", () => {
  for (const mountGap of [0, 2.5, "0mm"] as const) {
    expect(
      assemblyMotorProps.parse({
        name: "MOTOR",
        standard: "nema17",
        ...mounting,
        mountGap,
      }).mountGap,
    ).toBe(mountGap === "0mm" ? 0 : mountGap)
  }
})

test("rejects incomplete mounting, malformed references, and invalid clearances", () => {
  for (const invalid of [
    { mountedTo: "FRAME.xMotor" },
    { mountFace: "frontface" },
    { mountGap: 0 },
    { ...mounting, mountedTo: " " },
    { ...mounting, mountedTo: "FRAME" },
    { ...mounting, mountedTo: "FRAME." },
    { ...mounting, mountedTo: null },
    { ...mounting, mountFace: " " },
    { ...mounting, mountFace: null },
    { ...mounting, mountGap: -1 },
    { ...mounting, mountGap: "-1mm" },
    { ...mounting, mountGap: Infinity },
    { ...mounting, mountGap: NaN },
    { ...mounting, mountGap: "invalid" },
  ]) {
    expect(
      assemblyMotorProps.safeParse({
        name: "MOTOR",
        standard: "nema17",
        ...invalid,
      }).success,
    ).toBe(false)
  }
})

test("rejects competing world shaft directions, including explicit z+", () => {
  for (const shaftFacingDirection of ["x+", "x-", "y+", "y-", "z+", "z-"]) {
    const result = assemblyMotorProps.safeParse({
      name: "MOTOR",
      standard: "nema17",
      ...mounting,
      shaftFacingDirection,
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues).toContainEqual({
        code: "custom",
        path: ["shaftFacingDirection"],
        message: "Mounted motors derive shaft direction from the mating faces",
      })
    }
  }
})

test("unmounted motors retain the existing default and explicit direction", () => {
  const input = { name: "MOTOR", standard: "nema17" } as const
  expect(assemblyMotorProps.parse(input)).toEqual({
    ...input,
    shaftFacingDirection: "z+",
  })
  expect(
    assemblyMotorProps.parse({ ...input, shaftFacingDirection: "x-" }),
  ).toEqual({ ...input, shaftFacingDirection: "x-" })
})
