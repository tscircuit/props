import { expect, test } from "bun:test"
import { opampProps, type OpAmpProps } from "lib/components/opamp"
import { z } from "zod"
import { expectTypeOf } from "expect-type"

test("should parse opamp props with connections", () => {
  const rawProps: OpAmpProps = {
    name: "opamp",
    connections: {
      inverting_input: "net.IN-",
      non_inverting_input: "net.IN+",
      output: "net.OUT",
      positive_supply: "net.V+",
      negative_supply: "net.V-",
    },
  }

  expectTypeOf(rawProps).toMatchTypeOf<z.input<typeof opampProps>>()

  const parsedProps = opampProps.parse(rawProps)

  expect(parsedProps.connections).toEqual({
    inverting_input: "net.IN-",
    non_inverting_input: "net.IN+",
    output: "net.OUT",
    positive_supply: "net.V+",
    negative_supply: "net.V-",
  })
})

test("should reject connections with invalid keys", () => {
  expect(() => {
    opampProps.parse({
      name: "opamp",
      connections: {
        invalidKey: "net.INVALID",
        inverting_input: "net.IN-",
      } as any,
    })
  }).toThrow(z.ZodError)
})

test("should allow optional connections", () => {
  const rawProps: OpAmpProps = {
    name: "opamp",
  }
  const parsedProps = opampProps.parse(rawProps)
  expect(parsedProps.connections).toBeUndefined()
})
