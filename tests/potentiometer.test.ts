import { expect, test } from "bun:test"
import { potentiometerProps, type PotentiometerProps } from "lib/components/potentiometer"
import type { z } from "zod"
import { expectTypeOf } from "expect-type"

test("should parse potentiometer props", () => {
  const rawProps: PotentiometerProps = {
    name: "pot1",
    resistance: "10k",
    wiper: 0.75
  }

  expectTypeOf(rawProps).toMatchTypeOf<z.input<typeof potentiometerProps>>()

  const parsedProps = potentiometerProps.parse(rawProps)

  expect(parsedProps.resistance).toBe(10000)
  expect(parsedProps.wiper).toBe(0.75)
})

test("should use default wiper position", () => {
  const rawProps: PotentiometerProps = {
    name: "pot2", 
    resistance: "5k"
  }

  const parsedProps = potentiometerProps.parse(rawProps)

  expect(parsedProps.wiper).toBe(0.5)
})
