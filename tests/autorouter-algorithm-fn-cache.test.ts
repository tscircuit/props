import { expect, test } from "bun:test"
import { expectTypeOf } from "expect-type"
import {
  type AutoroutingPhaseProps,
  autoroutingPhaseProps,
} from "lib/components/autoroutingphase"
import { type AutorouterConfig, autorouterConfig } from "lib/components/group"
import type { z } from "zod"

test("autorouter and autoroutingphase accept algorithmFn cache options", () => {
  const algorithmFn = async () => ({})
  const rawConfig: AutorouterConfig = {
    algorithmFn,
    algorithmFnCacheEnabled: false,
    algorithmFnCacheKey: "my-router@2",
  }
  expectTypeOf(rawConfig).toMatchTypeOf<z.input<typeof autorouterConfig>>()
  expect(autorouterConfig.parse(rawConfig)).toMatchObject({
    algorithmFn,
    algorithmFnCacheEnabled: false,
    algorithmFnCacheKey: "my-router@2",
  })

  const rawPhase: AutoroutingPhaseProps = {
    algorithmFn,
    algorithmFnCacheEnabled: true,
    algorithmFnCacheKey: "phase-router@1",
  }
  expectTypeOf(rawPhase).toMatchTypeOf<z.input<typeof autoroutingPhaseProps>>()
  expect(autoroutingPhaseProps.parse(rawPhase)).toMatchObject(rawPhase)

  expect(() =>
    autorouterConfig.parse({ algorithmFnCacheEnabled: "yes" }),
  ).toThrow()
})
