import { expect, test } from "bun:test"
import { portProps, type PortProps } from "lib/components/port"
import { expectTypeOf } from "expect-type"

test("should parse PortProps without direction", () => {
  const rawProps: PortProps = {
    name: "P1",
  }

  expectTypeOf(rawProps).toMatchTypeOf<PortProps>()

  const parsed = portProps.parse(rawProps)
  expect(parsed.name).toBe("P1")
  expect(parsed.direction).toBeUndefined()
})

test("should parse PortProps with provided direction", () => {
  const rawProps: PortProps = {
    name: "P2",
    direction: "right",
  }

  const parsed = portProps.parse(rawProps)
  expect(parsed.direction).toBe("right")
})
