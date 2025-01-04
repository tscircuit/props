import { expect, test } from "bun:test"
import { mosfetProps, type MosfetProps } from "../lib/components/mosfet"

test("should parse mosfet props for n channel type and enhancement mode", () => {
  const rawProps: MosfetProps = {
    name: "mosfet",
    channelType: "n",
    mosfetMode: "enhancement",
  }
  const parsedProps = mosfetProps.parse(rawProps)
  expect(parsedProps.channelType).toBe("n")
  expect(parsedProps.mosfetMode).toBe("enhancement")
})

test("should parse mosfet props for p channel type and depletion mode", () => {
  const rawProps: MosfetProps = {
    name: "mosfet",
    channelType: "p",
    mosfetMode: "depletion",
  }
  const parsedProps = mosfetProps.parse(rawProps)
  expect(parsedProps.channelType).toBe("p")
  expect(parsedProps.mosfetMode).toBe("depletion")
})

test("should fail to parse mosfet with invalid channelType", () => {
  const rawProps = {
    name: "mosfet",
    channelType: "INVALID",
    mosfetMode: "N/A",
  }
  expect(() => mosfetProps.parse(rawProps)).toThrow()
})
