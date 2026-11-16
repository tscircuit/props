import { expect, test } from "bun:test"
import { mosfetProps, type MosfetProps } from "../lib/components/mosfet"

test("preserves explicit mosfet physical pin labels", () => {
  const rawProps = {
    name: "Q1",
    channelType: "n",
    mosfetMode: "enhancement",
    pinLabels: { pin1: "gate", pin2: "source", pin3: "drain" },
  } as const satisfies MosfetProps
  expect(mosfetProps.parse(rawProps).pinLabels).toEqual(rawProps.pinLabels)
  expect(() =>
    mosfetProps.parse({ ...rawProps, pinLabels: { pin1: 42 } }),
  ).toThrow()
})
