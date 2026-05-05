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

test("autorouting phase accepts region with reroute", () => {
  const raw: AutoroutingPhaseProps = {
    phaseIndex: 2,
    reroute: true,
    region: {
      minX: 1,
      maxX: 10,
      minY: 2,
      maxY: 12,
    },
  }

  const parsed = autoroutingPhaseProps.parse(raw)
  expect(parsed.reroute).toBe(true)
  expect(parsed.region).toEqual({
    minX: 1,
    maxX: 10,
    minY: 2,
    maxY: 12,
  })
})

test("autorouting phase requires region when reroute is provided", () => {
  expect(() =>
    autoroutingPhaseProps.parse({
      reroute: false,
    }),
  ).toThrow("region is required when reroute is provided")
})
