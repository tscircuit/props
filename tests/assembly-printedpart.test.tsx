import { expect, test } from "bun:test"
import {
  assemblyPrintedPartProps,
  assemblyProps,
  boardProps,
  type AssemblyPrintedPartProps,
} from "../lib"

const Geometry = () => null
const jscad = <Geometry />

test("printedpart preserves JSX and parses paired face mounting and distances", () => {
  const input: AssemblyPrintedPartProps = {
    name: "SPACER",
    jscad,
    mountedTo: "MOTOR.backface",
    mountFace: "motor",
    mountGap: "2mm",
  }
  expect(assemblyProps.printedpart).toBe(assemblyPrintedPartProps)
  expect(assemblyPrintedPartProps.parse(input)).toEqual({
    ...input,
    mountGap: 2,
  })
  expect(assemblyPrintedPartProps.parse(input).jscad).toBe(jscad)
  expect(
    assemblyPrintedPartProps.parse({ name: "FREE", jscad }).mountGap,
  ).toBeUndefined()
  expect(boardProps.parse({ mountedTo: "SPACER.board" }).mountedTo).toBe(
    "SPACER.board",
  )
  for (const extra of [
    { jscad: null },
    { jscad: {} },
    { name: " " },
    { mountedTo: "MOTOR" },
    { mountedTo: "MOTOR.backface" },
    { mountFace: "motor" },
    { mountGap: 1 },
    { mountedTo: "MOTOR.backface", mountFace: "motor", mountGap: -1 },
    { mountedTo: "MOTOR.backface", mountFace: "motor", mountGap: Infinity },
  ]) {
    expect(
      assemblyPrintedPartProps.safeParse({ name: "SPACER", jscad, ...extra })
        .success,
    ).toBe(false)
  }
})
