import { expect, test } from "bun:test"
import { type AssemblyCableProps, assemblyCableProps } from "lib"

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
  })
  const cable = { name: "C1", from: ".J1", to: ".J2" }
  for (const invalid of [
    { lengthTolerance: "3mm" },
    { length: 0 },
    { length: "50mm", lengthTolerance: -1 },
    { fromConnectorName: " " },
    { wireAwg: "thick" },
  ])
    expect(assemblyCableProps.safeParse({ ...cable, ...invalid }).success).toBe(
      false,
    )
})
