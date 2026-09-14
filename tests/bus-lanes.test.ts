import { expect, test } from "bun:test"
import { autoroutingPhaseProps } from "../lib/components/autoroutingphase"
import { autorouterProp } from "../lib/components/group"

test("bus_lanes is accepted as an autorouter preset", () => {
  expect(autorouterProp.parse("bus_lanes")).toBe("bus_lanes")
  expect(autorouterProp.parse({ preset: "bus_lanes" })).toMatchObject({
    preset: "bus_lanes",
  })
  expect(
    autoroutingPhaseProps.parse({
      autorouter: "bus_lanes",
      connections: ["SOC.DDR_D0"],
    }).autorouter,
  ).toBe("bus_lanes")
})
