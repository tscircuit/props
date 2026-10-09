import { expect, test } from "bun:test"
import { pcbNoiseEyeProps } from "lib/index"
import { eye } from "./fixtures/pcb-noise"

test("advanced known-UI and explicit-clock timing preserve origins and reject conflicts", () => {
  expect(
    pcbNoiseEyeProps.parse({
      ...eye,
      timing: {
        kind: "known_ui",
        unitInterval: "2ns",
        epoch: "0ns",
        sampleOffset: "1ns",
      },
    }).timing,
  ).toEqual({
    kind: "known_ui",
    unitInterval: 2e-9,
    sampleOffset: 1e-9,
    origin: { kind: "authored_epoch", epoch: 0 },
  })
  expect(
    pcbNoiseEyeProps.safeParse({
      ...eye,
      timing: {
        kind: "known_ui",
        unitInterval: "2ns",
        sampleOffset: "1ns",
        origin: {
          kind: "one_phase_estimate",
          trainingInterval: { start: "2ns", end: "66ns" },
        },
      },
    }).success,
  ).toBe(true)
  for (const timing of [
    { kind: "known_ui", unitInterval: "2ns", sampleOffset: "1ns" },
    {
      kind: "known_ui",
      unitInterval: "2ns",
      sampleOffset: "1ns",
      epoch: 0,
      origin: { kind: "authored_epoch", epoch: 0 },
    },
    { kind: "known_ui", unitInterval: "2ns", sampleOffset: "2ns", epoch: 0 },
    {
      kind: "known_ui",
      unitInterval: "2ns",
      sampleOffset: 0,
      origin: {
        kind: "one_phase_estimate",
        trainingInterval: { start: 1, end: 1 },
      },
    },
  ])
    expect(pcbNoiseEyeProps.safeParse({ ...eye, timing }).success).toBe(false)
  const timing = {
    kind: "explicit_clock" as const,
    clock: { kind: "observation" as const, clockObservation: "clock_voltage" },
    edge: "both" as const,
    threshold: "0.5V",
    uiPerSelectedEdge: 1,
    sampleOffset: "1ns",
    interpretation: "actual_receiver_clock" as const,
  }
  expect(pcbNoiseEyeProps.parse({ ...eye, timing }).timing).toEqual({
    ...timing,
    threshold: 0.5,
    sampleOffset: 1e-9,
  })
  expect(
    pcbNoiseEyeProps.safeParse({
      ...eye,
      timing: {
        ...timing,
        clock: { kind: "authored_edges", edgeSource: "victim_source" },
      },
    }).success,
  ).toBe(false)
  expect(
    pcbNoiseEyeProps.safeParse({
      ...eye,
      timing: {
        ...timing,
        interpretation: "nominal_reference",
        clock: { kind: "authored_edges", edgeSource: "victim_source" },
      },
    }).success,
  ).toBe(true)
  expect(
    pcbNoiseEyeProps.safeParse({
      ...eye,
      timing: {
        ...timing,
        clock: { kind: "observation", clockObservation: "victim_load_voltage" },
      },
    }).success,
  ).toBe(false)
  for (const field of [
    "clock",
    "edge",
    "threshold",
    "uiPerSelectedEdge",
    "sampleOffset",
    "interpretation",
  ] as const) {
    const input = { ...timing }
    delete (input as Partial<typeof input>)[field]
    expect(pcbNoiseEyeProps.safeParse({ ...eye, timing: input }).success).toBe(
      false,
    )
  }
})
