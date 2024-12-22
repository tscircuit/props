import { expect, test } from "bun:test"
import {
  transistorProps,
  type TransistorProps,
} from "../lib/components/transistor"
import { expectTypeOf } from "expect-type"

test("should parse transistor props for NPN transistor", () => {
  const rawProps: TransistorProps = {
    name: "transistor",
    transistorType: "NPN",
    pinLabels: {
      emitter: "E",
      base: "B",
      collector: "C",
    },
    collectorEmitterVoltage: "5V",
    baseEmitterVoltage: "0.7V",
    collectorCurrent: "10mA",
  }

  const parsedProps = transistorProps.parse(rawProps)
  expect(parsedProps.transistorType).toBe("NPN")
  expect(parsedProps.collectorEmitterVoltage).toBe(5)
  expect(parsedProps.collectorCurrent).toBe(0.01)
})

test("should parse transistor props for PNP transistor", () => {
  const rawProps: TransistorProps = {
    name: "transistor",
    transistorType: "PNP",
    pinLabels: {
      emitter: "E",
      base: "B",
      collector: "C",
    },
    collectorEmitterVoltage: 3.3,
    baseEmitterVoltage: 0.6,
    collectorCurrent: 20,
  }

  const parsedProps = transistorProps.parse(rawProps)
  expect(parsedProps.transistorType).toBe("PNP")
  expect(parsedProps.collectorEmitterVoltage).toBe(3.3)
  expect(parsedProps.baseEmitterVoltage).toBe(0.6)
  expect(parsedProps.collectorCurrent).toBe(20)
})

test("should fail to parse transistor props with invalid transistor type", () => {
  const rawProps = {
    name: "transistor",
    transistorType: "INVALID",
    pinLabels: {
      emitter: "E",
      base: "B",
      collector: "C",
    },
    collectorEmitterVoltage: "5V",
    baseEmitterVoltage: "0.7V",
    collectorCurrent: "10mA",
  }

  expect(() => transistorProps.parse(rawProps)).toThrow()
})

test("should enforce correct types for transistor props", () => {
  const rawProps: TransistorProps = {
    name: "transistor",
    transistorType: "NPN",
    pinLabels: {
      emitter: "E",
      base: "B",
      collector: "C",
    },
    collectorEmitterVoltage: "5V",
    baseEmitterVoltage: "0.7V",
    collectorCurrent: "10mA",
  }

  expectTypeOf(rawProps).toMatchTypeOf<TransistorProps>()
})
