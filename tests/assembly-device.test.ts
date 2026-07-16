import { expect, test } from "bun:test"
import {
  type AssemblyDevicePropsInput,
  assemblyDeviceProps,
  assemblyProps,
} from "lib/assembly"

test("parses assembly.device props", () => {
  const input: AssemblyDevicePropsInput = { name: "controller" }

  expect(assemblyDeviceProps.parse(input)).toEqual({ name: "controller" })
})

test("exposes device props through the assembly namespace", () => {
  expect(assemblyProps.device).toBe(assemblyDeviceProps)
})
