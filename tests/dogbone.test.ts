import { expect, test } from "bun:test"
import { autoroutingPhaseProps } from "../lib/components/autoroutingphase"
import { breakoutProps } from "../lib/components/breakout"
import {
  type AutorouterConfig,
  type AutorouterPreset,
  autorouterConfig,
  autorouterPreset,
  autorouterProp,
} from "../lib/components/group"

test("dogbone is a typed and validated fanout autorouter preset", () => {
  const preset: AutorouterPreset = "dogbone"
  const config = { preset: "dogbone" } satisfies AutorouterConfig

  // Test the closed schemas directly: autorouterProp also accepts custom strings.
  expect(autorouterPreset.parse(preset)).toBe("dogbone")
  expect(autorouterConfig.parse(config)).toEqual(config)
  for (const autorouter of [preset, config]) {
    expect(autorouterProp.parse(autorouter)).toEqual(autorouter)
    expect(breakoutProps.parse({ autorouter }).autorouter).toEqual(autorouter)
    expect(autoroutingPhaseProps.parse({ autorouter }).autorouter).toEqual(
      autorouter,
    )
  }
  expect(breakoutProps.parse({}).autorouter).toBe("fanout")
})
