import { expect, test } from "bun:test"
import { assemblyMotorProps } from "lib"

test("standard motor wire termination remains selectable without motor rotation offsets", () => {
  for (const wireConnection of [
    "none",
    "stubs",
    "jst6_ph",
    "jst4_sh",
    "custom_connection",
  ]) {
    expect(
      assemblyMotorProps.parse({
        name: "M1",
        standard: "nema17",
        wireConnection,
      }).wireConnection,
    ).toBe(wireConnection)
  }
  expect(assemblyMotorProps.parse({ name: "M1", standard: "nema17" })).toEqual({
    name: "M1",
    standard: "nema17",
    shaftFacingDirection: "z+",
  })
  for (const wireConnection of ["jst-ph-6", "jst_ph_6"] as const) {
    expect(
      assemblyMotorProps.parse({
        name: "M1",
        standard: "nema17",
        wireConnection,
      }).wireConnection,
    ).toBe("jst6_ph")
    expect(
      assemblyMotorProps.safeParse({
        name: "M1",
        model: "nema17_jstph6",
        wireConnection,
      }).success,
    ).toBe(false)
  }
  expect(
    assemblyMotorProps.safeParse({
      name: "M1",
      standard: "nema17",
      wireConnection: 6,
    }).success,
  ).toBe(false)
  expect(
    assemblyMotorProps.safeParse({
      name: "M1",
      model: "nema17",
      wireConnection: "stubs",
    }).success,
  ).toBe(false)
})
