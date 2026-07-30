import { expect, test } from "bun:test"
import { busProps, type BusProps } from "lib/components/bus"

test("busProps accepts two or more connection references", () => {
  const rawProps = {
    name: "DATA",
    connections: ["D0", ".U1 > .D1"],
  } satisfies BusProps

  expect(busProps.parse(rawProps)).toEqual(rawProps)
})
