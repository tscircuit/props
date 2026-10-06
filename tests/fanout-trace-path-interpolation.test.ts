import { expect, test } from "bun:test"
import {
  autoroutingPhaseProps,
  breakoutProps,
  fanoutTracePath,
  type FanoutTracePath,
} from "../lib"

const wire = {
  route_type: "wire",
  x: 0,
  y: 0,
  width: 0.8,
  layer: "top",
} as const
const end = { ...wire, x: 1, width: 0.2 }

test("saved route interpolation retains modes and normalizes point widths", () => {
  for (const schema of [breakoutProps, autoroutingPhaseProps]) {
    for (const mode of ["linear", "quadratic"] as const) {
      const path: FanoutTracePath = {
        connection: "U1.1",
        route: [
          { ...wire, width: "800um", width_interpolation_mode: mode },
          { ...end, width: "0.2mm", width_interpolation_mode: mode },
          { ...wire, x: 2 },
        ],
      }
      const parsed = schema.parse({ pcbTracePaths: [path] })
      expect(parsed.pcbTracePaths?.[0]?.route).toEqual([
        { ...wire, width_interpolation_mode: mode },
        { ...end, width_interpolation_mode: mode },
        { ...wire, x: 2 },
      ])
    }
  }
})

test("ordinary differing widths remain unchanged and interpolation can end at a via contact", () => {
  const route = [wire, end]
  expect(fanoutTracePath.parse({ connection: "U1.1", route }).route).toEqual(
    route,
  )
  const input = {
    connection: "U1.1",
    route: [
      { ...wire, width_interpolation_mode: "quadratic" },
      end,
      { route_type: "via", x: 1, y: 0, from_layer: "top", to_layer: "bottom" },
    ],
  } as const
  expect(fanoutTracePath.safeParse(input).success).toBe(true)
})

test("interpolation rejects terminal, coincident, via and cross-layer endpoints", () => {
  const start = { ...wire, width_interpolation_mode: "quadratic" }
  for (const route of [
    [wire, { ...end, width_interpolation_mode: "quadratic" }],
    [start, { ...end, x: 0 }],
    [start, { ...end, layer: "bottom" }],
    [
      start,
      { route_type: "via", x: 1, y: 0, from_layer: "top", to_layer: "bottom" },
    ],
    [{ ...start, width_interpolation_mode: "unsupported" }, end],
  ]) {
    expect(
      fanoutTracePath.safeParse({ connection: "U1.1", route }).success,
    ).toBe(false)
  }
})
