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

test("preserves explicit physical pin labels and readonly aliases", () => {
  const rawProps = {
    name: "Q1",
    type: "npn",
    pinLabels: { pin1: ["base", "INPUT"], pin2: "emitter", pin3: "collector" },
  } as const satisfies TransistorProps
  expect(transistorProps.parse(rawProps).pinLabels).toEqual(rawProps.pinLabels)
  expect(
    transistorProps.parse({ name: "Q1", type: "pnp" }).pinLabels,
  ).toBeUndefined()
  expect(() =>
    transistorProps.parse({ ...rawProps, pinLabels: { pin1: 42 } }),
  ).toThrow()
})
