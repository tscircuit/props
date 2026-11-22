import { expect, test } from "bun:test"
import {
  type AssemblyCableWireProps,
  assemblyCableWireProps,
  assemblyProps,
} from "lib"

test("assembly.cablewire normalizes pins and gauge and leaves unstated attributes absent", () => {
  expect(assemblyProps.cablewire).toBe(assemblyCableWireProps)
  const wire: AssemblyCableWireProps = {
    name: " B+ ",
    fromPin: "pin4",
    toPin: 2,
    color: "black",
    awg: "22 AWG",
  }
  expect(assemblyCableWireProps.parse(wire)).toEqual({
    name: "B+",
    fromPin: 4,
    toPin: 2,
    color: "black",
    awg: 22,
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
