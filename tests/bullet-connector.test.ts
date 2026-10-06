import { expect, test } from "bun:test"
import { assemblyCableProps, connectorProps } from "lib"

test("bullet connector props require a supported diameter and endpoint gender", () => {
  expect(
    connectorProps.parse({
      name: "J1",
      standard: "bullet",
      bulletDiameter: "3.5mm",
      bulletGender: "female",
      pinCount: 1,
    }),
  ).toMatchObject({ bulletDiameter: 3.5, bulletGender: "female" })
  for (const fields of [
    {},
    { bulletDiameter: 4 },
    { bulletGender: "male" },
    { bulletDiameter: 7, bulletGender: "male" },
    { bulletDiameter: 4, bulletGender: "socket" },
    { bulletDiameter: 4, bulletGender: "male", pinCount: 17 },
  ]) {
    expect(
      connectorProps.safeParse({ name: "J1", standard: "bullet", ...fields })
        .success,
    ).toBe(false)
  }
  expect(
    connectorProps.safeParse({
      name: "J1",
      standard: "usb_c",
      bulletDiameter: 4,
    }).success,
  ).toBe(false)
  expect(
    assemblyCableProps.parse({
      name: "POWER",
      from: ".J1",
      to: ".J2",
      standard: "bullet",
    }).standard,
  ).toBe("bullet")
})

test("bullet groups accept a contact count and reject out-of-range counts", () => {
  for (const pinCount of [1, 2, 3, 6, 16]) {
    expect(
      connectorProps.parse({
        name: "J1",
        standard: "bullet",
        bulletDiameter: 3.5,
        bulletGender: "male",
        pinCount,
      }).pinCount,
    ).toBe(pinCount)
  }
  for (const pinCount of [0, -1, 1.5, 17]) {
    expect(
      connectorProps.safeParse({
        name: "J1",
        standard: "bullet",
        bulletDiameter: 3.5,
        bulletGender: "male",
        pinCount,
      }).success,
    ).toBe(false)
  }
})
