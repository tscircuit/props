import { expect, test } from "bun:test"
import {
  transistorProps,
  type TransistorProps,
} from "../lib/components/transistor"

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
