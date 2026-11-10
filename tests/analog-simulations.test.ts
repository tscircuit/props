import { expect, test } from "bun:test"
import { analogAcSweepSimulationProps } from "lib/components/analogacsweepsimulation"
import { analogDcOperatingPointSimulationProps } from "lib/components/analogdcoperatingpointsimulation"
import { analogDcSweepSimulationProps } from "lib/components/analogdcsweepsimulation"
import { analogSweepParameterProps } from "lib/components/analogsweepparameter"
import { analogTransientSimulationProps } from "lib/components/analogtransientsimulation"

test("analog transient simulation parses defaults and timing units", () => {
  expect(analogTransientSimulationProps.parse({})).toEqual({
    duration: 10,
    startTime: 0,
    timePerStep: 0.01,
  })
  expect(
    analogTransientSimulationProps.parse({
      duration: "2s",
      startTime: "500ms",
      timePerStep: "10us",
    }),
  ).toMatchObject({
    duration: 2000,
    startTime: 500,
    timePerStep: 0.01,
  })
  expect(() =>
    analogTransientSimulationProps.parse({
      duration: "1ms",
      startTime: "2ms",
    }),
  ).toThrow("startTime must be between zero and duration")
})

test("analog DC analyses parse operating-point and sweep props", () => {
  expect(
    analogDcOperatingPointSimulationProps.parse({
      name: "bias",
      spiceEngine: "ngspice",
    }),
  ).toEqual({ name: "bias", spiceEngine: "ngspice" })

  expect(
    analogDcSweepSimulationProps.parse({
      sweepSource: ".V1",
      sweepStart: "0V",
      sweepStop: "5V",
      sweepStep: "500mV",
    }),
  ).toMatchObject({
    sweepSource: ".V1",
    sweepStart: 0,
    sweepStop: 5,
    sweepStep: 0.5,
  })
  expect(() =>
    analogDcSweepSimulationProps.parse({
      sweepSource: ".V1",
      sweepStart: 0,
      sweepStop: 5,
      sweepStep: -1,
    }),
  ).toThrow("sweepStep must move from sweepStart toward sweepStop")
})

test("analog AC sweep enforces sweep-specific sample settings", () => {
  expect(
    analogAcSweepSimulationProps.parse({
      sweepType: "linear",
      startFrequency: "10Hz",
      stopFrequency: "1kHz",
      sampleCount: 100,
    }),
  ).toMatchObject({
    sweepType: "linear",
    startFrequency: 10,
    stopFrequency: 1000,
    sampleCount: 100,
  })
  expect(
    analogAcSweepSimulationProps.parse({
      sweepType: "decade",
      startFrequency: "10Hz",
      stopFrequency: "1MHz",
      samplesPerInterval: 20,
    }),
  ).toMatchObject({
    sweepType: "decade",
    samplesPerInterval: 20,
  })
  expect(() =>
    analogAcSweepSimulationProps.parse({
      sweepType: "octave",
      startFrequency: "10Hz",
      stopFrequency: "1kHz",
      sampleCount: 100,
    }),
  ).toThrow("samplesPerInterval is required for decade or octave sweeps")
})

test("analog parameter sweep accepts values or a complete range", () => {
  expect(
    analogSweepParameterProps.parse({
      parameterType: "resistance",
      resistorRef: ".R1",
      values: ["1k", "2k"],
    }),
  ).toMatchObject({ values: [1000, 2000] })
  expect(
    analogSweepParameterProps.parse({
      parameterType: "capacitance",
      capacitorRef: ".C1",
      start: "10nF",
      stop: "50nF",
      step: "10nF",
    }),
  ).toMatchObject({
    start: 10e-9,
    stop: 50e-9,
    step: 10e-9,
  })
  expect(() =>
    analogSweepParameterProps.parse({
      parameterType: "voltage",
      net: "VCC",
    }),
  ).toThrow("Provide either values or start/stop/step")
  expect(() =>
    analogSweepParameterProps.parse({
      parameterType: "inductance",
      inductorRef: ".L1",
      start: "1mH",
      stop: "2mH",
    }),
  ).toThrow("start, stop, and step must be provided together")
  expect(() =>
    analogSweepParameterProps.parse({
      parameterType: "current",
      currentSourceRef: ".I1",
      values: ["1mA"],
      start: "1mA",
      stop: "2mA",
      step: "1mA",
    }),
  ).toThrow("Provide either values or start/stop/step")
})
