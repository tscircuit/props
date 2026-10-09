import { expect, test } from "bun:test"
import { pcbNoiseEyeProps } from "lib/index"
import { eye } from "./fixtures/pcb-noise"

test("source eye timing explicitly selects nominal PRBS channel timing without overrides", () => {
  expect(
    pcbNoiseEyeProps.parse({
      ...eye,
      channel: " victim ",
      timing: { kind: "source", channel: " victim ", sampleOffset: "1ns" },
    }),
  ).toEqual({
    channel: "victim",
    timing: { kind: "source", channel: "victim", sampleOffset: 1e-9 },
  })
  for (const timing of [
    {},
    { kind: "source", channel: "victim" },
    { kind: "source", sampleOffset: 0 },
    { kind: "source", channel: " ", sampleOffset: 0 },
    { kind: "source", channel: "victim", sampleOffset: -1 },
    { kind: "source", channel: "victim", sampleOffset: "1V" },
    { kind: "source", channel: "victim", sampleOffset: 0, epoch: 0 },
    { kind: "source", channel: "victim", sampleOffset: 0, unitInterval: "2ns" },
    {
      kind: "source",
      channel: "victim",
      sampleOffset: 0,
      interpretation: "actual_receiver_clock",
    },
    {
      kind: "recovered_clock",
      method: "edge_lattice",
      baudSearchRange: ["400MHz", "600MHz"],
      trainingInterval: { start: 0, end: "128ns" },
    },
  ])
    expect(pcbNoiseEyeProps.safeParse({ ...eye, timing }).success).toBe(false)
  for (const input of [
    { channel: "victim" },
    { ...eye, observation: "victim_voltage" },
    { ...eye, modulation: "nrz" },
  ]) {
    expect(pcbNoiseEyeProps.safeParse(input).success).toBe(false)
  }
})
