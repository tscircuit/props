import { expect, test } from "bun:test"
import {
  analogDigitalStimulusProps,
  analogEyeDiagramProps,
  analogTransientSimulationProps,
  ibisModelProps,
} from "../lib"
import type { IbisModelProps } from "../lib"

test("IBIS declarations preserve explicit choices and normalize time units", () => {
  const model = {
    componentRef: ".U1",
    source: { url: "https://example.com/model.ibs", sha256: "a".repeat(64) },
    component: "DRIVER",
    pinMap: { "1": "pin1" },
    corner: "typical",
    packagePolicy: "vendor",
  } satisfies IbisModelProps
  expect(ibisModelProps.parse(model)).toEqual(model)
  expect(
    ibisModelProps.safeParse({ ...model, corner: undefined }).success,
  ).toBe(false)
  expect(
    ibisModelProps.safeParse({
      ...model,
      source: { ...model.source, file: "other.ibs" },
    }).success,
  ).toBe(false)
  expect(
    ibisModelProps.safeParse({ ...model, source: { url: model.source.url } })
      .success,
  ).toBe(false)
  const stimulus = {
    name: "data",
    simulationRef: ".run",
    drives: ".U1 > .pin1",
    unitInterval: "2ns",
    startTime: "4ns",
    initialState: 0,
    pattern: { type: "bits", bits: "0101", repeat: true },
  }
  expect(analogDigitalStimulusProps.parse(stimulus).unitInterval).toBeCloseTo(
    0.000002,
    14,
  )
  expect(analogDigitalStimulusProps.parse(stimulus).inverted).toBe(false)
  expect(
    analogDigitalStimulusProps.safeParse({
      ...stimulus,
      pattern: { type: "bits", bits: "012", repeat: true },
    }).success,
  ).toBe(false)
  expect(
    analogDigitalStimulusProps.safeParse({
      ...stimulus,
      initialState: undefined,
    }).success,
  ).toBe(false)
  const pinStates = { ".U1 > .pin1": { mode: "output", enabled: false } }
  expect(
    analogTransientSimulationProps.safeParse({
      executionMode: "external",
      ibisPinStates: pinStates,
    }).success,
  ).toBe(true)
  expect(
    analogTransientSimulationProps.safeParse({ ibisPinStates: pinStates })
      .success,
  ).toBe(false)
  expect(
    analogTransientSimulationProps.safeParse({
      executionMode: "external",
      ibisPinStates: { pin: { mode: "output" } },
    }).success,
  ).toBe(false)
  expect(
    analogTransientSimulationProps.safeParse({
      executionMode: "external",
      ibisPinStates: { pin: { mode: "input", enabled: true } },
    }).success,
  ).toBe(false)
  const eye = {
    name: "eye",
    simulationRef: ".run",
    probeRef: ".probe",
    unitInterval: "2ns",
    timeOrigin: "0ns",
    startTime: "8ns",
    endTime: "4ns",
  }
  expect(analogEyeDiagramProps.safeParse(eye).success).toBe(false)
  expect(
    analogEyeDiagramProps.safeParse({ ...eye, endTime: "20ns" }).success,
  ).toBe(true)
})
