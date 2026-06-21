import { expect, test } from "bun:test"
import {
  analogSimulationProps,
  type AnalogSimulationProps,
} from "lib/components/analogsimulation"
import { expectTypeOf } from "expect-type"
import { z } from "zod"

test("analog simulation defaults to spice transient analysis", () => {
  const raw: AnalogSimulationProps = {}

  expectTypeOf(raw).toMatchTypeOf<z.input<typeof analogSimulationProps>>()

  const parsed = analogSimulationProps.parse(raw)
  expect(parsed.simulationType).toBe("spice_transient_analysis")
})

test("analog simulation accepts name", () => {
  const raw: AnalogSimulationProps = {
    name: "tran1",
  }

  expectTypeOf(raw).toMatchTypeOf<z.input<typeof analogSimulationProps>>()

  const parsed = analogSimulationProps.parse(raw)
  expect(parsed.name).toBe("tran1")
})

test("analog simulation accepts time parameters", () => {
  const raw: AnalogSimulationProps = {
    duration: "1ms",
    startTime: "697.58us",
    timePerStep: "1us",
  }

  expectTypeOf(raw).toMatchTypeOf<z.input<typeof analogSimulationProps>>()

  const parsed = analogSimulationProps.parse(raw)
  expect(parsed.duration).toBe(1)
  expect(parsed.startTime).toBeCloseTo(0.69758)
  expect(parsed.timePerStep).toBe(0.001)
})

test("analog simulation accepts spice engine selection", () => {
  const raw: AnalogSimulationProps = {
    spiceEngine: "spicey",
  }

  expectTypeOf(raw).toMatchTypeOf<z.input<typeof analogSimulationProps>>()

  const parsed = analogSimulationProps.parse(raw)
  expect(parsed.spiceEngine).toBe("spicey")
})

test("analog simulation accepts spice options", () => {
  const raw: AnalogSimulationProps = {
    spiceOptions: {
      method: "gear",
      reltol: 0.01,
      abstol: "1n",
      vntol: "1u",
    },
  }

  expectTypeOf(raw).toMatchTypeOf<z.input<typeof analogSimulationProps>>()

  const parsed = analogSimulationProps.parse(raw)
  expect(parsed.spiceOptions).toEqual({
    method: "gear",
    reltol: 0.01,
    abstol: "1n",
    vntol: "1u",
  })
})
