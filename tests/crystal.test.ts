import { expect, test } from "bun:test"
import { crystalProps, type CrystalProps } from "../lib/components/crystal"
import type { z } from "zod"
import { expectTypeOf } from "expect-type"

test("should parse crystal props with 2pin variant", () => {
  const rawProps: CrystalProps = {
    name: "crystal",
    frequency: "16MHz",
    loadCapacitance: "20pF",
    pinVariant: "two_pin",
  }

  const parsedProps = crystalProps.parse(rawProps)
  expect(parsedProps.pinVariant).toBe("two_pin")
})

test("should parse manufacturerPartNumber and mpn", () => {
  const rawProps: CrystalProps = {
    name: "crystal",
    frequency: "16MHz",
    loadCapacitance: "20pF",
    manufacturerPartNumber: "1234",
    mpn: "5678",
  }

  const parsedProps = crystalProps.parse(rawProps)

  expect(parsedProps.manufacturerPartNumber).toBe("1234")
  expect(parsedProps.mpn).toBe("5678")
})

test("should parse crystal props with 4pin variant", () => {
  const rawProps: CrystalProps = {
    name: "crystal",
    frequency: "16MHz",
    loadCapacitance: "20pF",
    pinVariant: "four_pin",
  }

  const parsedProps = crystalProps.parse(rawProps)
  expect(parsedProps.pinVariant).toBe("four_pin")
})

test("should allow optional connections", () => {
  const rawProps: CrystalProps = {
    name: "crystal",
    frequency: "16MHz",
    loadCapacitance: "20pF",
  }
  const parsedProps = crystalProps.parse(rawProps)
  expect(parsedProps.connections).toBeUndefined()
})

test("should parse crystal props with connections", () => {
  const rawProps: CrystalProps = {
    name: "crystal",
    frequency: "16MHz",
    loadCapacitance: "20pF",
    connections: {
      left: "net.CLK_IN",
      right: "net.CLK_OUT",
    },
  }

  const parsedProps = crystalProps.parse(rawProps)
  expect(parsedProps.connections).toEqual({
    left: "net.CLK_IN",
    right: "net.CLK_OUT",
  })
})
