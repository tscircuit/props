import { expect, test } from "bun:test"
import * as props from "../lib"

test("snapshot native net class prop support", () => {
  expect({ netClassProps: "netClassProps" in props }).toMatchSnapshot()
})

test.failing(
  "net classes accept unit-aware widths and explicit net selectors",
  () => {
    const schema = Reflect.get(props, "netClassProps")
    expect(schema).toBeDefined()
    expect(
      schema.parse({ name: "Power", traceWidth: "800um", nets: ["net.VCC"] }),
    ).toEqual({
      name: "Power",
      traceWidth: 0.8,
      nets: ["net.VCC"],
    })
  },
)
