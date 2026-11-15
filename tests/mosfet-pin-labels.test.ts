import { expect, test } from "bun:test"
import { mosfetProps, type MosfetProps } from "../lib/components/mosfet"

test("preserves explicit physical pin labels and readonly aliases", () => {
  const rawProps = {
    name: "Q1",
    channelType: "n",
    mosfetMode: "enhancement",
    pinLabels: { pin1: ["gate", "INPUT"], pin2: "source", pin3: "drain" },
  } as const satisfies MosfetProps
  expect(mosfetProps.parse(rawProps).pinLabels).toEqual(rawProps.pinLabels)
  expect(
    mosfetProps.parse({
      name: "Q1",
      channelType: "p",
      mosfetMode: "enhancement",
    }).pinLabels,
  ).toBeUndefined()
  expect(() =>
    mosfetProps.parse({ ...rawProps, pinLabels: { pin1: 42 } }),
  ).toThrow()
})
