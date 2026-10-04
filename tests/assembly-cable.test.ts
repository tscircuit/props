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
