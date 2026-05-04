import { expect, test } from "bun:test"
import { expectTypeOf } from "expect-type"
import { z } from "zod"
import {
  autoroutingPhaseProps,
  type AutoroutingPhaseProps,
} from "lib/components/autoroutingphase"

test("autorouting phase accepts autorouter and phase index", () => {
  const raw: AutoroutingPhaseProps = {
    autorouter: "sequential_trace",
    phaseIndex: 1,
  }

  expectTypeOf(raw).toMatchTypeOf<z.input<typeof autoroutingPhaseProps>>()

  const parsed = autoroutingPhaseProps.parse(raw)
  expect(parsed.autorouter).toBe("sequential_trace")
  expect(parsed.phaseIndex).toBe(1)
})

test("autorouting phase accepts autorouter config", () => {
  const raw: AutoroutingPhaseProps = {
    autorouter: {
      preset: "auto_local",
      traceClearance: "0.2mm",
    },
    phaseIndex: 0,
  }

  const parsed = autoroutingPhaseProps.parse(raw)
  expect(parsed.autorouter).toMatchObject({
    preset: "auto_local",
    traceClearance: 0.2,
  })
})
