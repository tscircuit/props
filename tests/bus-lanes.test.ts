import { expect, test } from "bun:test"
import { autoroutingPhaseProps } from "../lib/components/autoroutingphase"
import { breakoutProps } from "../lib/components/breakout"
import {
  type AutorouterConfig,
  type AutorouterPreset,
  autorouterConfig,
  autorouterPreset,
  autorouterProp,
  subcircuitGroupPropsWithBool,
} from "../lib/components/group"

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

for (const alias of ["single_layer_routing"] as const) {
  test(`${alias} is a typed alias that normalizes to bus_lanes`, () => {
    const preset: AutorouterPreset = alias
    const config = {
      preset: alias,
      traceClearance: "0.2mm",
      allowViaInPad: true,
    } satisfies AutorouterConfig
    const parsedConfig = {
      preset: "bus_lanes" as const,
      traceClearance: 0.2,
      allowViaInPad: true,
    }

    // The closed schemas must accept aliases too; autorouterProp accepts custom strings.
    expect(autorouterPreset.parse(preset)).toBe("bus_lanes")
    expect(autorouterConfig.parse(config)).toEqual(parsedConfig)
    for (const autorouter of [preset, config]) {
      const expected =
        typeof autorouter === "string" ? "bus_lanes" : parsedConfig
      expect(autorouterProp.parse(autorouter)).toEqual(expected)
      expect(autoroutingPhaseProps.parse({ autorouter }).autorouter).toEqual(
        expected,
      )
      expect(breakoutProps.parse({ autorouter }).autorouter).toEqual(expected)
      expect(
        subcircuitGroupPropsWithBool.parse({ subcircuit: true, autorouter })
          .autorouter,
      ).toEqual(expected)
    }
  })
}

test("single-layer routing preserves canonical presets, custom strings, and defaults", () => {
  expect(autorouterPreset.parse("bus_lanes")).toBe("bus_lanes")
  expect(autorouterConfig.parse({ preset: "bus_lanes" })).toEqual({
    preset: "bus_lanes",
  })
  expect(autorouterProp.parse("custom_router")).toBe("custom_router")
  expect(autorouterConfig.parse({})).toEqual({})
  expect(autoroutingPhaseProps.parse({}).autorouter).toBeUndefined()
  expect(breakoutProps.parse({}).autorouter).toBe("fanout")
})
