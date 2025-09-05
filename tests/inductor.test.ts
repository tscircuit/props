import { expect, test } from "bun:test"
import { inductorProps, type InductorProps } from "lib/components/inductor"
import { z } from "zod"

test("should parse inductor props with single string connections", () => {
  const rawProps: InductorProps = {
    name: "L1",
    inductance: 10,
    connections: {
      pin1: "net.A",
      pin2: "net.B",
    },
  }
  const parsedProps = inductorProps.parse(rawProps)
  expect(parsedProps.connections).toEqual({
    pin1: "net.A",
    pin2: "net.B",
  })
})

test("should parse inductor props with array connections", () => {
  const rawProps: InductorProps = {
    name: "L1",
    inductance: 10,
    connections: {
      pin1: ["net.A", "net.A2"],
      pin2: ["net.B", "net.B2"],
    },
  }
  const parsedProps = inductorProps.parse(rawProps)
  expect(parsedProps.connections).toEqual({
    pin1: ["net.A", "net.A2"],
    pin2: ["net.B", "net.B2"],
  })
})

test("should reject connections with invalid keys", () => {
  expect(() => {
    inductorProps.parse({
      name: "L1",
      inductance: 10,
      connections: {
        invalid: "net.INVALID",
      } as any,
    })
  }).toThrow(z.ZodError)
})

test("should allow optional connections", () => {
  const rawProps: InductorProps = {
    name: "L1",
    inductance: 10,
  }
  const parsedProps = inductorProps.parse(rawProps)
  expect(parsedProps.connections).toBeUndefined()
})
