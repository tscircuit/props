import { expect, test } from "bun:test"
import { expectTypeOf } from "expect-type"
import {
  pcbNoiseSimulationProps,
  pcbNoisePortProps,
  pcbNoiseExcitationProps,
  pcbNoiseTerminationProps,
  pcbNoiseObservationProps,
  pcbNoiseEyeProps,
  type PcbNoiseExcitationProps,
  type PcbNoiseEyeProps,
  simulationProps,
} from "lib/index"

const excitation: PcbNoiseExcitationProps = {
  name: "aggressor",
  port: "a_tx",
  role: "aggressor",
  sourceModel: { kind: "thevenin", resistance: "50ohm" },
  waveform: {
    kind: "prbs",
    order: 7,
    baudRate: "500MHz",
    lowVoltage: "0V",
    highVoltage: "1V",
    riseTime: "200ps",
    fallTime: "200ps",
    edgeTimeConvention: "10_90",
    seed: 1,
    algorithm: "lfsr_fibonacci",
    algorithmVersion: "1",
  },
}
const eye: PcbNoiseEyeProps = {
  observation: "victim_voltage",
  modulation: "nrz",
  timing: {
    kind: "known_ui",
    unitInterval: "2ns",
    epoch: "0ns",
    sampleOffset: "1ns",
  },
}

test("all six strict noise hosts are exported in the simulation namespace", () => {
  expect(simulationProps.pcbnoisesimulation).toBe(pcbNoiseSimulationProps)
  expect(simulationProps.pcbnoiseport).toBe(pcbNoisePortProps)
  expect(simulationProps.pcbnoiseexcitation).toBe(pcbNoiseExcitationProps)
  expect(simulationProps.pcbnoisetermination).toBe(pcbNoiseTerminationProps)
  expect(simulationProps.pcbnoiseobservation).toBe(pcbNoiseObservationProps)
  expect(simulationProps.pcbnoiseeye).toBe(pcbNoiseEyeProps)
})

test("duration and samples are SI seconds, with no legacy millisecond conversion", () => {
  for (const [input, expected] of [
    [0.001, 0.001],
    ["1ms", 0.001],
    ["1e-3s", 0.001],
    ["1000000ns", 0.001],
  ] as const) {
    const parsed = pcbNoiseSimulationProps.parse({
      duration: input,
      sampleInterval: "20ps",
    })
    expect(parsed.duration).toBeCloseTo(expected, 15)
    expect(parsed.sampleInterval).toBeCloseTo(20e-12, 20)
    expectTypeOf(parsed.duration).toEqualTypeOf<number>()
  }
  const parsed = pcbNoiseSimulationProps.parse({
    name: " Two line ",
    duration: "512ns",
    sampleInterval: "20ps",
    baseline: {
      kind: "quiet_sources",
      sourceNames: [" aggressor "],
      voltage: "0V",
    },
    children: ["ports"],
  })
  expect(parsed.name).toBe("Two line")
  expect(parsed.baseline).toEqual({
    kind: "quiet_sources",
    sourceNames: ["aggressor"],
    voltage: 0,
  })
  for (const duration of [
    "1msjunk",
    "1s 2s",
    "1V",
    "1 ns trailing",
    "Infinitys",
    NaN,
    Infinity,
    0,
    -1,
  ]) {
    expect(
      pcbNoiseSimulationProps.safeParse({ duration, sampleInterval: "1ps" })
        .success,
    ).toBe(false)
  }
  for (const input of [
    {},
    { duration: 1 },
    { sampleInterval: 1 },
    { duration: 1, sampleInterval: 2 },
    { duration: 1, sampleInterval: 1 },
    { duration: 1, sampleInterval: 0 },
    { duration: 1, sampleInterval: 0.1, clock: "synthetic" },
  ]) {
    expect(pcbNoiseSimulationProps.safeParse(input).success).toBe(false)
  }
  expect(
    pcbNoiseSimulationProps.safeParse({
      duration: 1,
      sampleInterval: 0.1,
      baseline: {
        kind: "quiet_sources",
        sourceNames: ["a", " a "],
        voltage: 0,
      },
    }).success,
  ).toBe(false)
})

test("physical selectors normalize layers without adding geometry or forbidding shared references", () => {
  for (const name of ["a_tx", "v_tx"]) {
    expect(
      pcbNoisePortProps.parse({
        name,
        signal: " .U1 > .SIGNAL ",
        reference: " .U1 > .GND ",
        signalLayer: "top",
        referenceLayer: { name: "bottom" },
      }),
    ).toEqual({
      name,
      signal: ".U1 > .SIGNAL",
      reference: ".U1 > .GND",
      signalLayer: "top",
      referenceLayer: "bottom",
    })
  }
  for (const input of [
    { name: "a_tx", signal: ".U1 > .OUT" },
    { name: "a_tx", signal: " ", reference: ".U1 > .GND" },
    {
      name: "a_tx",
      signal: ".U1 > .OUT",
      reference: ".U1 > .GND",
      referenceLayer: "bogus",
    },
    { name: "a_tx", signal: ".U1 > .OUT", reference: ".U1 > .GND", x: "1mm" },
  ]) {
    expect(pcbNoisePortProps.safeParse(input).success).toBe(false)
  }
})

test("seeded PRBS defines finite edges, peak voltage levels and symbol baud rate", () => {
  const parsed = pcbNoiseExcitationProps.parse(excitation)
  expect(parsed.sourceModel.resistance).toBe(50)
  expectTypeOf(parsed.sourceModel.resistance).toEqualTypeOf<number>()
  if (parsed.waveform.kind !== "prbs") throw new Error("Expected PRBS")
  expect(parsed.waveform.baudRate).toBe(500e6)
  expect(parsed.waveform.riseTime).toBeCloseTo(200e-12, 18)
  expect(parsed.waveform.highVoltage).toBe(1)
  expectTypeOf(parsed.waveform.riseTime).toEqualTypeOf<number>()
  if (excitation.waveform.kind !== "prbs")
    throw new Error("Expected PRBS fixture")
  for (const changes of [
    { seed: 0 },
    { seed: 128 },
    { seed: 1.5 },
    { order: 8 },
    { algorithm: "random" },
    { algorithmVersion: "2" },
    { riseTime: 0 },
    { riseTime: "2ns" },
    { riseTime: "1.6ns" },
    { fallTime: -1 },
    { lowVoltage: "1V" },
    { highVoltage: "1V trailing" },
    { baudRate: "500MBps" },
    { edgeTimeConvention: "full_ramp" },
    { amplitude: "1V" },
  ]) {
    expect(
      pcbNoiseExcitationProps.safeParse({
        ...excitation,
        waveform: { ...excitation.waveform, ...changes },
      }).success,
    ).toBe(false)
  }
  // Explicitly remove required reproducibility fields rather than filling defaults.
  for (const field of [
    "seed",
    "algorithm",
    "algorithmVersion",
    "riseTime",
    "fallTime",
    "baudRate",
  ] as const) {
    const waveform = { ...excitation.waveform }
    delete (waveform as Partial<typeof waveform>)[field]
    expect(
      pcbNoiseExcitationProps.safeParse({ ...excitation, waveform }).success,
    ).toBe(false)
  }
  for (const resistance of ["50ohm trailing", "1F", 0, -1, Infinity]) {
    expect(
      pcbNoiseExcitationProps.safeParse({
        ...excitation,
        sourceModel: { kind: "thevenin", resistance },
      }).success,
    ).toBe(false)
  }
})

test("quiet victim DC preserves explicitly authored source impedance", () => {
  const quiet = pcbNoiseExcitationProps.parse({
    port: "v_tx",
    role: "victim",
    sourceModel: { kind: "thevenin", resistance: "100Ω" },
    waveform: { kind: "dc", voltage: "-20mV" },
  })
  expect(quiet.waveform).toEqual({ kind: "dc", voltage: -0.02 })
  expect(quiet.sourceModel.resistance).toBe(100)
  for (const input of [
    { port: "v_tx", role: "victim", waveform: { kind: "dc", voltage: 0 } },
    { ...quiet, waveform: { kind: "dc" } },
    { ...quiet, waveform: { kind: "dc", voltage: 0, seed: 1 } },
  ]) {
    expect(pcbNoiseExcitationProps.safeParse(input).success).toBe(false)
  }
})

test("loads and observations require explicit electrical values and remain passive", () => {
  expect(
    pcbNoiseTerminationProps.parse({
      port: "v_rx",
      model: {
        kind: "parallel_rc",
        resistance: "100ohm",
        capacitance: "1pF",
        biasVoltage: "0V",
      },
    }).model,
  ).toEqual({
    kind: "parallel_rc",
    resistance: 100,
    capacitance: 1e-12,
    biasVoltage: 0,
  })
  expect(
    pcbNoiseTerminationProps.parse({
      port: "v_rx",
      model: { kind: "resistor", resistance: 50, biasVoltage: 0 },
    }).model,
  ).toEqual({ kind: "resistor", resistance: 50, biasVoltage: 0 })
  for (const model of [
    {
      kind: "parallel_rc",
      resistance: 50,
      capacitance: "-1pF",
      biasVoltage: 0,
    },
    {
      kind: "parallel_rc",
      resistance: 50,
      capacitance: "1pF trailing",
      biasVoltage: 0,
    },
    { kind: "resistor", resistance: 50 },
    { kind: "resistor", resistance: "1V", biasVoltage: 0 },
    { kind: "resistor", resistance: 50, biasVoltage: 0, hiddenLoad: true },
  ]) {
    expect(
      pcbNoiseTerminationProps.safeParse({ port: "v_rx", model }).success,
    ).toBe(false)
  }
  expect(
    pcbNoiseObservationProps.parse({
      name: " victim_voltage ",
      port: "v_rx",
      quantity: "voltage",
    }),
  ).toEqual({ name: "victim_voltage", port: "v_rx", quantity: "voltage" })
  expect(
    pcbNoiseObservationProps.safeParse({
      name: "victim",
      port: "v_rx",
      quantity: "voltage",
      resistance: "50ohm",
    }).success,
  ).toBe(false)
})

test("known UI canonicalizes epoch once and rejects missing/conflicting timing", () => {
  expect(pcbNoiseEyeProps.parse(eye)).toEqual({
    observation: "victim_voltage",
    modulation: "nrz",
    timing: {
      kind: "known_ui",
      unitInterval: 2e-9,
      sampleOffset: 1e-9,
      origin: { kind: "authored_epoch", epoch: 0 },
    },
  })
  expect(
    pcbNoiseEyeProps.parse({
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
    }).timing.kind,
  ).toBe("known_ui")
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
    {
      kind: "known_ui",
      unitInterval: "2ns",
      sampleOffset: 0,
      epoch: 0,
      baudRate: "500MHz",
    },
  ]) {
    expect(pcbNoiseEyeProps.safeParse({ ...eye, timing }).success).toBe(false)
  }
})

test("explicit clock never invents receiver timing or symbol edge mapping", () => {
  const timing = {
    kind: "explicit_clock" as const,
    clock: { kind: "observation" as const, clockObservation: "clock_v" },
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
        clock: { kind: "authored_edges", edgeSource: "v_tx_source" },
      },
    }).success,
  ).toBe(false)
  expect(
    pcbNoiseEyeProps.safeParse({
      ...eye,
      timing: {
        ...timing,
        interpretation: "nominal_reference",
        clock: { kind: "authored_edges", edgeSource: "v_tx_source" },
      },
    }).success,
  ).toBe(true)
  expect(
    pcbNoiseEyeProps.safeParse({
      ...eye,
      timing: {
        ...timing,
        clock: { kind: "observation", clockObservation: eye.observation },
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

test("typed unknown-rate recovery is rejected with an explicit capability diagnostic", () => {
  const recovery: PcbNoiseEyeProps = {
    ...eye,
    timing: {
      kind: "recovered_clock",
      method: "cdr",
      baudSearchRange: ["400MHz", "600MHz"],
      trainingInterval: { start: 0, end: "128ns" },
      loopBandwidth: "1MHz",
      damping: 0.7,
    },
  }
  const result = pcbNoiseEyeProps.safeParse(recovery)
  expect(result.success).toBe(false)
  if (!result.success)
    expect(result.error.issues).toContainEqual({
      code: "custom",
      message: "recovered_clock is unsupported; use known_ui or explicit_clock",
      path: ["timing", "kind"],
    })
  expect(
    pcbNoiseEyeProps.safeParse({
      ...eye,
      timing: {
        kind: "recovered_clock",
        method: "edge_lattice",
        baudSearchRange: ["400MHz", "600MHz"],
        trainingInterval: { start: 0, end: "128ns" },
      },
    }).success,
  ).toBe(false)
})
