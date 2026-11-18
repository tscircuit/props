import { expect, test } from "bun:test"
import {
  type AssemblyCableProps,
  type AssemblyCableWireProps,
  assemblyCableProps,
  assemblyCableWireProps,
  assemblyProps,
} from "lib"

test("assembly.cable carries a build length, connector designators and wire defaults", () => {
  const input: AssemblyCableProps = {
    name: "MOTOR_CABLE",
    from: "MOTOR.wireside",
    to: ".CONTROLLER > .J_MOTOR",
    model: "adaptercable_a(jst_ph_pins6)_b(jst_ph_pins4)",
    length: "50mm",
    lengthTolerance: 3,
    fromConnectorName: " H1 ",
    toConnectorName: "H2",
    wireAwg: "22awg",
    wireStyle: "UL1007",
  }
  expect(assemblyCableProps.parse(input)).toEqual({
    name: "MOTOR_CABLE",
    from: "MOTOR.wireside",
    to: ".CONTROLLER > .J_MOTOR",
    model: "adaptercable_a(jst_ph_pins6)_b(jst_ph_pins4)",
    length: 50,
    lengthTolerance: 3,
    fromConnectorName: "H1",
    toConnectorName: "H2",
    wireAwg: 22,
    wireStyle: "UL1007",
  })
  const cable = { name: "C1", from: ".J1", to: ".J2" }
  for (const invalid of [
    { lengthTolerance: "3mm" },
    { length: 0 },
    { length: "50mm", lengthTolerance: -1 },
    { fromConnectorName: " " },
    { wireAwg: "thick" },
    { wireStyle: "" },
  ])
    expect(assemblyCableProps.safeParse({ ...cable, ...invalid }).success).toBe(
      false,
    )
})

test("assembly.cablewire normalizes pins and gauge and leaves unstated attributes absent", () => {
  expect(assemblyProps.cablewire).toBe(assemblyCableWireProps)
  const wire: AssemblyCableWireProps = {
    name: " B+ ",
    fromPin: "pin4",
    toPin: 2,
    color: "black",
    awg: "22 AWG",
    wireStyle: "UL1007",
  }
  expect(assemblyCableWireProps.parse(wire)).toEqual({
    name: "B+",
    fromPin: 4,
    toPin: 2,
    color: "black",
    awg: 22,
    wireStyle: "UL1007",
  })
  expect(assemblyCableWireProps.parse({ fromPin: "6", toPin: "PIN4" })).toEqual(
    { fromPin: 6, toPin: 4 },
  )
  for (const invalid of [
    { fromPin: 0 },
    { fromPin: 1.5 },
    { toPin: "pin0" },
    { toPin: "A1" },
    { toPin: undefined },
    { color: " " },
    { awg: "-2" },
    { awg: "22mm" },
  ])
    expect(
      assemblyCableWireProps.safeParse({ fromPin: 1, toPin: 1, ...invalid })
        .success,
    ).toBe(false)
})
