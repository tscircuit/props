import { expect, test } from "bun:test"
import { mosfetProps, type MosfetProps } from "../lib/components/mosfet"
import { expectTypeOf } from "expect-type"

test("should parse mosfet props for n-channel", () => {
  const rawProps: MosfetProps = {
    name: "mosfet",
    mosfetType: "n_channel_moset",
    schRotation: 0
  }
  const parsedProps = mosfetProps.parse(rawProps)
  expect(parsedProps.mosfetType).toBe("n_channel_moset")
})

test("should parse mosfet props for p-channel", () => {
  const rawProps: MosfetProps = {
    name: "mosfet",
    mosfetType: "p_channel_moset",
    schRotation: 90
  }
  const parsedProps = mosfetProps.parse(rawProps)
  expect(parsedProps.mosfetType).toBe("p_channel_moset")
})

test("should fail to parse mosfet with invalid mosfetType", () => {
  const rawProps = {
    name: "mosfet",
    mosfetType: "INVALID",
  }
  expect(() => mosfetProps.parse(rawProps)).toThrow()
})

test("should enforce correct types for mosfet props", () => {
  const rawProps: MosfetProps = {
    name: "mosfet",
    mosfetType: "n_channel_moset",
    schRotation: 180
  }
  expectTypeOf(rawProps).toMatchTypeOf<MosfetProps>()
})
