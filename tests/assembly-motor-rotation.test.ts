import { expect, test } from "bun:test"
import { assemblyMotorProps } from "lib"

test("motor rotation parses finite angles and preserves named direction expressions", () => {
  for (const [input, expected] of [
    [90, 90],
    ["-90deg", -90],
    [" 45 ", 45],
    ["calc(wireside+90deg)", "calc(wireside+90deg)"],
    ["calc(shaftflat - 45deg)", "calc(shaftflat - 45deg)"],
    [" WIRESIDE ", "wireside"],
  ] as const) {
    expect(
      assemblyMotorProps.parse({
        name: "M1",
        standard: "nema17",
        motorRotation: input,
      }).motorRotation,
    ).toBe(expected)
  }
  expect(
    assemblyMotorProps.parse({ name: "M1", standard: "nema17" }).motorRotation,
  ).toBe(0)
  for (const motorRotation of [
    NaN,
    Infinity,
    "calc(backface+90deg)",
    "calc(wireside+90)",
    "calc(wireside/0)",
    "calc(wireside+alert(1))",
    "abc",
    "90rad",
  ])
    expect(
      assemblyMotorProps.safeParse({
        name: "M1",
        standard: "nema17",
        motorRotation,
      }).success,
    ).toBe(false)
  expect(
    assemblyMotorProps.parse({
      name: "M1",
      standard: "nema17",
      wireConnection: "jst-ph-6",
    }).wireConnection,
  ).toBe("jst-ph-6")
  expect(
    assemblyMotorProps.safeParse({
      name: "M1",
      model: "nema17",
      wireConnection: "stubs",
    }).success,
  ).toBe(false)
})
