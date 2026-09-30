import { expect, test } from "bun:test"
import { autorouterProp } from "../lib/components/group"
import { autoroutingPhaseProps } from "../lib/components/autoroutingphase"

test("bus_lanes local fanout configuration is explicit and preset-scoped", () => {
  expect(
    autoroutingPhaseProps.parse({ autorouter: "bus_lanes" }).autorouter,
  ).toBe("bus_lanes")
  for (const fanout of ["auto", "none"] as const)
    expect(
      autorouterProp.parse({ preset: "bus_lanes", busLanesFanout: fanout }),
    ).toEqual({ preset: "bus_lanes", busLanesFanout: fanout })
  expect(
    autorouterProp.safeParse({ preset: "default", busLanesFanout: "auto" })
      .success,
  ).toBe(false)
  expect(
    autorouterProp.safeParse({
      preset: "bus_lanes",
      busLanesFanout: "boundary",
    }).success,
  ).toBe(false)
})
