import { expect, test } from "bun:test"
import {
  transistorProps,
  type TransistorProps,
} from "../lib/components/transistor"
import { expectTypeOf } from "expect-type"

test("should parse transistor props for npn transistor", () => {
  const rawProps: TransistorProps = {
    name: "transistor",
    type: "npn",
  }

  const parsedProps = transistorProps.parse(rawProps)
  expect(parsedProps.type).toBe("npn")
})

test("should parse transistor props for pnp transistor", () => {
  const rawProps: TransistorProps = {
    name: "transistor",
    type: "pnp",
  }

  const parsedProps = transistorProps.parse(rawProps)
  expect(parsedProps.type).toBe("pnp")
})

test("should fail to parse transistor props with invalid transistor type", () => {
  const rawProps = {
    name: "transistor",
    type: "INVALID",
  }

  expect(() => transistorProps.parse(rawProps)).toThrow()
})

test("should enforce correct types for transistor props", () => {
  const rawProps: TransistorProps = {
    name: "transistor",
    type: "npn",
  }

  expectTypeOf(rawProps).toMatchTypeOf<TransistorProps>()
})
