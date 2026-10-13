import { expect, test } from "bun:test"
import { boardProps } from "../lib/components/board"
import { groupProps } from "../lib/components/group"
import { fanoutProps } from "../lib/common/fanoutProps"

test("boards and subcircuits preserve and validate fanout defaults", () => {
  const defaults = {
    busFanoutDirections: { DDR: "bottomside_center" },
    fanoutBoundaryPadding: "1mm",
    fanoutRoutingLayers: ["top", "inner2", "bottom"],
    fanoutPourNetMap: { inner1: "net.GND", inner4: ["net.VDDR"] },
  }
  const expected = fanoutProps.parse(defaults)
  for (const parsed of [
    boardProps.parse(defaults),
    groupProps.parse({ subcircuit: true, ...defaults }),
  ]) {
    expect(fanoutProps.parse(parsed)).toEqual(expected)
  }
  expect(boardProps.safeParse({ fanoutRoutingLayers: [] }).success).toBe(false)
  expect(
    groupProps.safeParse({ subcircuit: true, fanoutPourNetMap: { inner1: [] } })
      .success,
  ).toBe(false)
  expect(boardProps.parse({}).fanoutPourNetMap).toBeUndefined()
})
