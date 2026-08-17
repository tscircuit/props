import { expect, test } from "bun:test"
import { busProps, type BusProps } from "lib/components/bus"

test("busProps accepts two or more connection references", () => {
  const rawProps = {
    name: "DATA",
    connections: ["D0", ".U1 > .D1"],
    routingPhaseIndex: 2,
  } satisfies BusProps

  expect(busProps.parse(rawProps)).toEqual(rawProps)
})

test("busProps accepts preferred routing layers", () => {
  const rawProps = {
    connections: ["D0", "D1"],
    preferredLayer: "inner1",
    preferredLayers: ["inner2", "bottom"],
  } satisfies BusProps

  expect(busProps.parse(rawProps)).toEqual(rawProps)
})

test("busProps rejects an empty preferredLayers array", () => {
  expect(() =>
    busProps.parse({ connections: ["D0", "D1"], preferredLayers: [] }),
  ).toThrow()
})
