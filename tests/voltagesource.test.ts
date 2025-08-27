import { expect, test } from "bun:test"
import {
  voltageSourceProps,
  type VoltageSourceProps,
} from "lib/components/voltagesource"

test("should parse voltage source props", () => {
  const rawProps: VoltageSourceProps = {
    name: "vs1",
    frequency: "1kHz",
    peakToPeakVoltage: "5V",
    waveShape: "sinewave",
  }
  const parsed = voltageSourceProps.parse(rawProps)
  expect(parsed.name).toBe("vs1")
  expect(parsed.frequency).toBe(1000)
  expect(parsed.peakToPeakVoltage).toBe(5)
  expect(parsed.waveShape).toBe("sinewave")
})

test("should parse with only a name", () => {
  const rawProps: VoltageSourceProps = {
    name: "vs2",
  }
  const parsed = voltageSourceProps.parse(rawProps)
  expect(parsed.name).toBe("vs2")
  expect(parsed.frequency).toBeUndefined()
  expect(parsed.peakToPeakVoltage).toBeUndefined()
  expect(parsed.waveShape).toBeUndefined()
})

test("should fail with invalid waveShape", () => {
  const rawProps = {
    name: "vs3",
    waveShape: "junkwave",
  }
  expect(() => voltageSourceProps.parse(rawProps as any)).toThrow()
})

test("should parse DC voltage source", () => {
  const rawProps: VoltageSourceProps = {
    name: "vs_dc",
    voltage: "12V",
  }
  const parsed = voltageSourceProps.parse(rawProps)
  expect(parsed.name).toBe("vs_dc")
  expect(parsed.voltage).toBe(12)
  expect(parsed.frequency).toBeUndefined()
  expect(parsed.peakToPeakVoltage).toBeUndefined()
  expect(parsed.waveShape).toBeUndefined()
})

test("should parse square wave props", () => {
  const rawProps: VoltageSourceProps = {
    name: "vs_sq",
    frequency: "1kHz",
    peakToPeakVoltage: "5V",
    waveShape: "square",
  }
  const parsed = voltageSourceProps.parse(rawProps)
  expect(parsed.waveShape).toBe("square")
})

test("should parse triangle wave props", () => {
  const rawProps: VoltageSourceProps = {
    name: "vs_tri",
    waveShape: "triangle",
  }
  const parsed = voltageSourceProps.parse(rawProps)
  expect(parsed.waveShape).toBe("triangle")
})

test("should parse with phase", () => {
  const rawProps: VoltageSourceProps = {
    name: "vs_phase",
    frequency: "1kHz",
    peakToPeakVoltage: "5V",
    phase: 90,
  }
  const parsed = voltageSourceProps.parse(rawProps)
  expect(parsed.phase).toBe(90)
})

test("should parse AC source with DC offset", () => {
  const rawProps: VoltageSourceProps = {
    name: "vs_offset",
    voltage: "1V",
    frequency: "1kHz",
    peakToPeakVoltage: "5V",
  }
  const parsed = voltageSourceProps.parse(rawProps)
  expect(parsed.voltage).toBe(1)
  expect(parsed.frequency).toBe(1000)
  expect(parsed.peakToPeakVoltage).toBe(5)
})

test("should parse duty cycle", () => {
  const rawProps: VoltageSourceProps = {
    name: "vs_duty",
    dutyCycle: "50%",
  }
  const parsed = voltageSourceProps.parse(rawProps)
  expect(parsed.dutyCycle).toBe(0.5)

  const rawProps2: VoltageSourceProps = {
    name: "vs_duty",
    dutyCycle: 0.25,
  }
  const parsed2 = voltageSourceProps.parse(rawProps2)
  expect(parsed2.dutyCycle).toBe(0.25)

  expect(() =>
    voltageSourceProps.parse({ name: "vs_duty", dutyCycle: "150%" }),
  ).toThrow()
  expect(() =>
    voltageSourceProps.parse({ name: "vs_duty", dutyCycle: 2 }),
  ).toThrow()
})
