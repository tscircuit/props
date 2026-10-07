import { expect, test } from "bun:test"
import { connectorProps, assemblyCableProps } from "lib"

test("physical model families are independent of connector standards", () => {
  expect(
    connectorProps.parse({ name: "J1", model: "bullet3_d3.5mm_gmale" }),
  ).toMatchObject({ model: "bullet3_d3.5mm_gmale" })
  expect(
    connectorProps.safeParse({ name: "J1", standard: "bullet" }).success,
  ).toBe(false)
  expect(
    assemblyCableProps.safeParse({
      name: "C1",
      from: ".J1",
      to: ".J2",
      standard: "bullet",
    }).success,
  ).toBe(false)
})
