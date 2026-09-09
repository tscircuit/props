import { expect, test } from "bun:test"
import {
  breakoutProps,
  fanoutTracePath,
  type BreakoutProps,
  type FanoutTracePath,
} from "../lib"

const path: FanoutTracePath = {
  connection: "U1.1",
  route: [
    { route_type: "wire", x: "0mm", y: 0, width: "0.2mm", layer: "top" },
    {
      route_type: "via",
      x: "1mm",
      y: "1mm",
      from_layer: "top",
      to_layer: "bottom",
      via_diameter: "0.6mm",
      via_hole_diameter: "0.3mm",
    },
    { route_type: "wire", x: "0.3cm", y: 1, width: 0.2, layer: "bottom" },
  ],
}

test("breakout retains JSON-serializable saved routes and normalizes distances", () => {
  const props: BreakoutProps = { pcbTracePaths: [path] }
  const original = JSON.stringify(props)
  const parsed = breakoutProps.parse(JSON.parse(original))
  expect(parsed.pcbTracePaths).toEqual([
    {
      connection: "U1.1",
      route: [
        { route_type: "wire", x: 0, y: 0, width: 0.2, layer: "top" },
        {
          route_type: "via",
          x: 1,
          y: 1,
          from_layer: "top",
          to_layer: "bottom",
          via_diameter: 0.6,
          via_hole_diameter: 0.3,
        },
        { route_type: "wire", x: 3, y: 1, width: 0.2, layer: "bottom" },
      ],
    },
  ])
  expect(JSON.stringify(props)).toBe(original)
  expect(breakoutProps.parse({}).pcbTracePaths).toBeUndefined()
  expect(breakoutProps.parse({ pcbTracePaths: [] }).pcbTracePaths).toEqual([])
})

test("saved fanout paths reject invalid geometry and layer transitions", () => {
  const wire = { route_type: "wire", x: 0, y: 0, width: 0.2, layer: "top" }
  for (const invalid of [
    { connection: "", route: [wire, wire] },
    { connection: "U1.1", route: [] },
    { connection: "U1.1", route: [wire] },
    { connection: "U1.1", route: [wire, { ...wire, x: Number.NaN }] },
    { connection: "U1.1", route: [wire, { ...wire, width: 0 }] },
    { connection: "U1.1", route: [wire, { ...wire, layer: "bottom" }] },
    {
      connection: "U1.1",
      route: [
        wire,
        {
          route_type: "via",
          x: 1,
          y: 1,
          from_layer: "top",
          to_layer: "bottom",
        },
      ],
    },
    {
      connection: "U1.1",
      route: [
        {
          route_type: "via",
          x: 0,
          y: 0,
          from_layer: "top",
          to_layer: "bottom",
        },
        wire,
      ],
    },
    {
      connection: "U1.1",
      route: [wire, { ...path.route[1], from_layer: "inner1" }, path.route[2]],
    },
  ])
    expect(fanoutTracePath.safeParse(invalid).success).toBe(false)
})
