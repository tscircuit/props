import { expect, test } from "bun:test"
import {
  type AssemblyCableProps,
  type AssemblyCablePropsInput,
  assemblyCableProps,
  assemblyProps,
} from "lib"

test("assembly.cable accepts motor references and scoped connector selectors", () => {
  expect(assemblyProps.cable).toBe(assemblyCableProps)
  const input: AssemblyCableProps = {
    name: "MOTOR_CABLE",
    from: "MOTOR.wireside",
    to: ".CONTROLLER > .J_MOTOR",
  }
  const props: AssemblyCablePropsInput = input
  expect(assemblyProps.cable.parse(props)).toEqual(input)
  expect(assemblyCableProps.parse(props).standard).toBeUndefined()
})

test("assembly.cable accepts the USB-C preset and trims endpoint references", () => {
  expect(
    assemblyCableProps.parse({
      name: " USB ",
      from: " .HOST > .J_USB ",
      to: " .CONTROLLER > .J_USB ",
      standard: "usb_c",
    }),
  ).toEqual({
    name: "USB",
    from: ".HOST > .J_USB",
    to: ".CONTROLLER > .J_USB",
    standard: "usb_c",
  })
})

test("assembly.cable requires an identity and two nonempty endpoint strings", () => {
  const valid = {
    name: "MOTOR_CABLE",
    from: "MOTOR.wireside",
    to: ".CONTROLLER > .J_MOTOR",
  }
  for (const field of ["name", "from", "to"] as const) {
    for (const value of [undefined, "", "  ", null, 12, { x: 0, y: 0 }]) {
      expect(
        assemblyCableProps.safeParse({ ...valid, [field]: value }).success,
      ).toBe(false)
    }
  }
  for (const standard of ["USB_C", "usb-c", "usb_c ", "", null, 12]) {
    expect(assemblyCableProps.safeParse({ ...valid, standard }).success).toBe(
      false,
    )
  }
})

test("assembly.cable accepts an explicit model without changing standard behavior", () => {
  const input = {
    name: "C1",
    from: ".J1",
    to: ".J2",
    model: "adaptercable_a(jst_sh_pins4)_b(jst_ph_pins4)",
  }
  expect(assemblyCableProps.parse(input)).toEqual(input)
  for (const model of ["", " ", 4, null])
    expect(assemblyCableProps.safeParse({ ...input, model }).success).toBe(
      false,
    )
})

test("assembly.cable preserves ordered numeric circuit-world waypoints", () => {
  const input: AssemblyCableProps = {
    name: "PITCH_CABLE",
    from: ".CONTROLLER > .J_PITCH",
    to: "PITCH_MOTOR.wireside",
    waypoints: [
      { x: -35, y: 0, z: 8 },
      { x: -35, y: 45.5, z: 8 },
      { x: -25, y: 45.5, z: 60 },
    ],
  }
  const props: AssemblyCablePropsInput = input
  expect(assemblyCableProps.parse(props)).toEqual(input)
})

test("assembly.cable keeps omitted waypoints omitted", () => {
  const props = assemblyCableProps.parse({
    name: "C1",
    from: ".J1",
    to: ".J2",
  })
  expect(props).not.toHaveProperty("waypoints")
})

test("assembly.cable accepts an empty waypoint list for automatic routing", () => {
  expect(
    assemblyCableProps.parse({
      name: "C1",
      from: ".J1",
      to: ".J2",
      waypoints: [],
    }).waypoints,
  ).toEqual([])
})

test("assembly.cable requires all three waypoint coordinates", () => {
  expect(
    assemblyCableProps.safeParse({
      name: "C1",
      from: ".J1",
      to: ".J2",
      waypoints: [{ x: 1, y: 2 }],
    }).success,
  ).toBe(false)
})

test("assembly.cable rejects string waypoint coordinates", () => {
  expect(
    assemblyCableProps.safeParse({
      name: "C1",
      from: ".J1",
      to: ".J2",
      waypoints: [{ x: "1mm", y: 2, z: 3 }],
    }).success,
  ).toBe(false)
})

test("assembly.cable rejects NaN waypoint coordinates", () => {
  expect(
    assemblyCableProps.safeParse({
      name: "C1",
      from: ".J1",
      to: ".J2",
      waypoints: [{ x: Number.NaN, y: 2, z: 3 }],
    }).success,
  ).toBe(false)
})

test("assembly.cable rejects positive infinity waypoint coordinates", () => {
  expect(
    assemblyCableProps.safeParse({
      name: "C1",
      from: ".J1",
      to: ".J2",
      waypoints: [{ x: 1, y: Number.POSITIVE_INFINITY, z: 3 }],
    }).success,
  ).toBe(false)
})

test("assembly.cable rejects negative infinity waypoint coordinates", () => {
  expect(
    assemblyCableProps.safeParse({
      name: "C1",
      from: ".J1",
      to: ".J2",
      waypoints: [{ x: 1, y: 2, z: Number.NEGATIVE_INFINITY }],
    }).success,
  ).toBe(false)
})
