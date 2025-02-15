import { expect, test } from "bun:test"
import { switchProps, type SwitchProps } from "../lib/components/switch"

test("should parse switch props with type value", () => {
  const rawProps: SwitchProps = {
    name: "transistor",
    type: "dpst",
  }

  const parsedProps = switchProps.parse(rawProps)
  expect(parsedProps.type).toBe("dpst")
})

test("should parse switch props with flag value", () => {
  const rawProps: SwitchProps = {
    name: "transistor",
    dpst: true,
  }

  const parsedProps = switchProps.parse(rawProps)
  expect(parsedProps.dpst).toBe(true)
})

test("should fail to parse switch props with invalid switch type", () => {
  const rawProps = {
    name: "transistor",
    dpst: true,
  }

  const parsedProps = switchProps.parse(rawProps)
  expect(parsedProps.dpst).toBe(false)
})
