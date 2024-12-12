import { expect, test } from "bun:test"
import { crystalProps, type CrystalProps } from "../lib/components/crystal"
import type { z } from "zod"
import { expectTypeOf } from "expect-type"

test("should parse crystal props with 2pin variant", () => {
  const rawProps: CrystalProps = {
    name: "crystal",
    frequency: "16MHz",
    loadCapacitance: "20pF",
    pinVariant: "2pin",
  }

  const parsedProps = crystalProps.parse(rawProps)
  expect(parsedProps.pinVariant).toBe("2pin")
})

test("should parse crystal props with 4pin variant", () => {
  const rawProps: CrystalProps = {
    name: "crystal",
    frequency: "16MHz",
    loadCapacitance: "20pF",
    pinVariant: "4pin",
  }

  const parsedProps = crystalProps.parse(rawProps)
  expect(parsedProps.pinVariant).toBe("4pin")
})
