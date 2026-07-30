import { expect, test } from "bun:test"
import { busProps, type BusProps } from "lib/components/bus"

test("busProps accepts two or more connection references", () => {
  const rawProps = {
    name: "DATA",
    connections: ["D0", ".U1 > .D1"],
  } satisfies BusProps

  expect(busProps.parse(rawProps)).toEqual(rawProps)
})

test("busProps accepts a source-only plane connection", () => {
  const rawProps = {
    name: "GROUND_A1",
    connections: ["GND_A1"],
    fanoutTermination: {
      type: "plane",
      layer: "inner1",
    },
  } satisfies BusProps

  expect(busProps.parse(rawProps)).toEqual(rawProps)
})

test("busProps rejects a single boundary connection", () => {
  expect(
    busProps.safeParse({
      name: "DATA",
      connections: ["D0"],
    }).success,
  ).toBe(false)
})
