import { expect, test } from "bun:test"
import { assemblyMotorProps } from "lib"

test("standard motor wire termination remains selectable without motor rotation offsets", () => {
  for (const wireConnection of ["none", "stubs", "jst-ph-6"] as const) {
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
  expect(
    assemblyMotorProps.safeParse({
      name: "M1",
      model: "nema17",
      wireConnection: "stubs",
    }).success,
  ).toBe(false)
})
