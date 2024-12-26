import { expect, test } from "bun:test"
import { mosfetProps, type MosfetProps } from "../lib/components/mosfet"
import { expectTypeOf } from "expect-type"

test("should parse mosfet props for nmos", () => {
  const rawProps: MosfetProps = {
    name: "mosfet",
    channelType: "nmos",
  }
  const parsedProps = mosfetProps.parse(rawProps)
  expect(parsedProps.channelType).toBe("nmos")
})

test("should parse mosfet props for pmos", () => {
  const rawProps: MosfetProps = {
    name: "mosfet",
    channelType: "pmos",
  }
  const parsedProps = mosfetProps.parse(rawProps)
  expect(parsedProps.channelType).toBe("pmos")
})

test("should fail to parse mosfet with invalid channelType", () => {
  const rawProps = {
    name: "mosfet",
    channelType: "INVALID",
  }
  expect(() => mosfetProps.parse(rawProps)).toThrow()
})

test("should enforce correct types for mosfet props", () => {
  const rawProps: MosfetProps = {
    name: "mosfet",
    channelType: "nmos",
  }
  expectTypeOf(rawProps).toMatchTypeOf<MosfetProps>()
})
