import { expect, test } from "bun:test"
import * as props from "../lib"

test("snapshot native net class prop support", () => {
  expect({ netClassProps: "netClassProps" in props }).toMatchSnapshot()
})

test("net classes accept unit-aware widths and explicit net selectors", () => {
  const schema = Reflect.get(props, "netClassProps")
  expect(schema).toBeDefined()
  expect(
    schema.parse({ name: "Power", traceWidth: "800um", nets: ["net.VCC"] }),
  ).toEqual({
    name: "Power",
    traceWidth: 0.8,
    nets: ["net.VCC"],
  })
})

test("classes validate selectors, dimensions and precedence without inventing widths", () => {
  const schema = props.netClassProps
  expect(schema.parse({ name: "Inherited", nets: [] })).toEqual({
    name: "Inherited",
    nets: [],
  })
  for (const traceWidth of [0, -1, Infinity, NaN, "-1mm"]) {
    expect(
      schema.safeParse({ name: "Power", nets: [], traceWidth }).success,
    ).toBe(false)
  }
  expect(schema.safeParse({ name: "Power", nets: [".R1"] }).success).toBe(false)
  expect(
    schema.safeParse({ name: "Power", nets: [], priority: -1 }).success,
  ).toBe(false)
})
