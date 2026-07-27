import { expect, test } from "bun:test"
import { busProps, type BusProps } from "lib/components/bus"

test("busProps accepts two or more connection references", () => {
  const rawProps: BusProps = {
    name: "DATA",
    connections: ["D0", ".U1 > .D1"],
    pcbFanoutDirection: "right",
    pcbFanoutPreferredExit: "top_right",
  }

  expect(busProps.parse(rawProps)).toEqual(rawProps)
})

test("busProps rejects a single connection", () => {
  expect(
    busProps.safeParse({
      name: "DATA",
      connections: ["D0"],
    }).success,
  ).toBe(false)
})
