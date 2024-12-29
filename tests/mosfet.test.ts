import { expect, test } from "bun:test"
import { mosfetProps, type MosfetProps } from "../lib/components/mosfet"

test("should parse mosfet props for n-channel", () => {
  const rawProps: MosfetProps = {
    name: "mosfet",
    channelType: "n_channel_mosfet",
  }
  const parsedProps = mosfetProps.parse(rawProps)
  expect(parsedProps.channelType).toBe("n_channel_mosfet")
})

test("should parse mosfet props for p-channel", () => {
  const rawProps: MosfetProps = {
    name: "mosfet",
    channelType: "p_channel_mosfet",
  }
  const parsedProps = mosfetProps.parse(rawProps)
  expect(parsedProps.channelType).toBe("p_channel_mosfet")
})

test("should fail to parse mosfet with invalid channelType", () => {
  const rawProps = {
    name: "mosfet",
    channelType: "INVALID",
  }
  expect(() => mosfetProps.parse(rawProps)).toThrow()
})
