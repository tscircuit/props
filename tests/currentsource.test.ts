import { expect, test } from "bun:test"
import {
  currentSourceProps,
  type CurrentSourceProps,
} from "lib/components/currentsource"
import { z } from "zod"

test("should parse current source props", () => {
  const rawProps: CurrentSourceProps = {
    name: "is1",
    frequency: "1kHz",
    peakToPeakCurrent: "5A",
    waveShape: "sinewave",
  }
  const parsed = currentSourceProps.parse(rawProps)
  expect(parsed.name).toBe("is1")
  expect(parsed.frequency).toBe(1000)
  expect(parsed.peakToPeakCurrent).toBe(5)
  expect(parsed.waveShape).toBe("sinewave")
})

test("should parse with only a name", () => {
  const rawProps: CurrentSourceProps = {
    name: "is2",
  }
  const parsed = currentSourceProps.parse(rawProps)
  expect(parsed.name).toBe("is2")
  expect(parsed.frequency).toBeUndefined()
  expect(parsed.peakToPeakCurrent).toBeUndefined()
  expect(parsed.waveShape).toBeUndefined()
})

test("should fail with invalid waveShape", () => {
  const rawProps = {
    name: "is3",
    waveShape: "junkwave",
  }
  expect(() => currentSourceProps.parse(rawProps as any)).toThrow()
})

test("should parse DC current source", () => {
  const rawProps: CurrentSourceProps = {
    name: "is_dc",
    current: "12A",
  }
  const parsed = currentSourceProps.parse(rawProps)
  expect(parsed.name).toBe("is_dc")
  expect(parsed.current).toBe(12)
  expect(parsed.frequency).toBeUndefined()
  expect(parsed.peakToPeakCurrent).toBeUndefined()
  expect(parsed.waveShape).toBeUndefined()
})

test("should parse square wave props", () => {
  const rawProps: CurrentSourceProps = {
    name: "is_sq",
    frequency: "1kHz",
    peakToPeakCurrent: "5A",
    waveShape: "square",
  }
  const parsed = currentSourceProps.parse(rawProps)
  expect(parsed.waveShape).toBe("square")
})

test("should parse triangle wave props", () => {
  const rawProps: CurrentSourceProps = {
    name: "is_tri",
    waveShape: "triangle",
  }
  const parsed = currentSourceProps.parse(rawProps)
  expect(parsed.waveShape).toBe("triangle")
})

test("should parse with phase", () => {
  const rawProps: CurrentSourceProps = {
    name: "is_phase",
    frequency: "1kHz",
    peakToPeakCurrent: "5A",
    phase: 90,
  }
  const parsed = currentSourceProps.parse(rawProps)
  expect(parsed.phase).toBe(90)
})

test("should parse AC source with DC offset", () => {
  const rawProps: CurrentSourceProps = {
    name: "is_offset",
    current: "1A",
    frequency: "1kHz",
    peakToPeakCurrent: "5A",
  }
  const parsed = currentSourceProps.parse(rawProps)
  expect(parsed.current).toBe(1)
  expect(parsed.frequency).toBe(1000)
  expect(parsed.peakToPeakCurrent).toBe(5)
})

test("should parse small-signal AC source props", () => {
  const rawProps: CurrentSourceProps = {
    name: "is_ac",
    acMagnitude: "2A",
    acPhase: "90deg",
  }
  const parsed = currentSourceProps.parse(rawProps)
  expect(parsed.acMagnitude).toBe(2)
  expect(parsed.acPhase).toBe(90)
})

test("should parse duty cycle", () => {
  const rawProps: CurrentSourceProps = {
    name: "is_duty",
    dutyCycle: "50%",
  }
  const parsed = currentSourceProps.parse(rawProps)
  expect(parsed.dutyCycle).toBe(0.5)

  const rawProps2: CurrentSourceProps = {
    name: "is_duty",
    dutyCycle: 0.25,
  }
  const parsed2 = currentSourceProps.parse(rawProps2)
  expect(parsed2.dutyCycle).toBe(0.25)

  expect(() =>
    currentSourceProps.parse({ name: "is_duty", dutyCycle: "150%" }),
  ).toThrow()
  expect(() =>
    currentSourceProps.parse({ name: "is_duty", dutyCycle: 2 }),
  ).toThrow()
})

test("should parse current source props with single string connections", () => {
  const rawProps: CurrentSourceProps = {
    name: "is_conn",
    connections: {
      pos: "net.VCC",
      neg: "net.GND",
    },
  }
  const parsed = currentSourceProps.parse(rawProps)
  expect(parsed.connections).toEqual({
    pos: "net.VCC",
    neg: "net.GND",
  })
})

test("should parse current source props with array connections", () => {
  const rawProps: CurrentSourceProps = {
    name: "is_conn_arr",
    connections: {
      pos: ["net.VCC", "net.5V"],
      neg: ["net.GND"],
    },
  }
  const parsed = currentSourceProps.parse(rawProps)
  expect(parsed.connections).toEqual({
    pos: ["net.VCC", "net.5V"],
    neg: ["net.GND"],
  })
})

test("should reject connections with invalid keys", () => {
  expect(() => {
    currentSourceProps.parse({
      name: "is_invalid_conn",
      connections: {
        invalid: "net.X",
      } as any,
    })
  }).toThrow(z.ZodError)
})

test("should allow optional connections", () => {
  const rawProps: CurrentSourceProps = {
    name: "is_no_conn",
  }
  const parsed = currentSourceProps.parse(rawProps)
  expect(parsed.connections).toBeUndefined()
})

test("should parse a piecewise-linear current waveform", () => {
  const parsed = currentSourceProps.parse({
    name: "ILOAD",
    currentWaveform: [
      { time: "0ms", current: "100mA" },
      { time: "1ms", current: "100mA" },
      { time: "1.001ms", current: "1A" },
    ],
  })

  expect(parsed.currentWaveform).toEqual([
    { time: 0, current: 0.1 },
    { time: 1, current: 0.1 },
    { time: 1.001, current: 1 },
  ])
})

test("should reject non-increasing current waveform times", () => {
  expect(() =>
    currentSourceProps.parse({
      name: "ILOAD",
      currentWaveform: [
        { time: "1ms", current: "100mA" },
        { time: "1ms", current: "1A" },
      ],
    }),
  ).toThrow("Waveform times must be strictly increasing")
})
