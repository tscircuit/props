import { expect, test } from "bun:test"
import { mosfetProps, type MosfetProps } from "../lib/components/mosfet"
import { z } from "zod"

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

test("should parse mosfet props with connections", () => {
  const rawProps: MosfetProps = {
    name: "M1",
    channelType: "n",
    mosfetMode: "enhancement",
    connections: {
      gate: "net.GATE",
      drain: ["net.DRAIN", "net.SENSE"],
      source: "net.GND",
    },
  }

  const parsedProps = mosfetProps.parse(rawProps)

  expect(parsedProps.connections).toEqual({
    gate: "net.GATE",
    drain: ["net.DRAIN", "net.SENSE"],
    source: "net.GND",
  })
})

test("should parse mosfet connections using pin aliases", () => {
  const rawProps: MosfetProps = {
    name: "M1",
    channelType: "p",
    mosfetMode: "depletion",
    connections: {
      pin1: "net.DRAIN",
      pin2: "net.SOURCE",
      pin3: "net.GATE",
    },
  }

  const parsedProps = mosfetProps.parse(rawProps)

  expect(parsedProps.connections).toEqual(rawProps.connections)
})

test("should reject mosfet connections with invalid keys", () => {
  expect(() =>
    mosfetProps.parse({
      name: "M1",
      channelType: "n",
      mosfetMode: "enhancement",
      connections: {
        invalid: "net.INVALID",
      },
    }),
  ).toThrow(z.ZodError)
})

test("should allow optional mosfet connections", () => {
  const rawProps: MosfetProps = {
    name: "M1",
    channelType: "n",
    mosfetMode: "enhancement",
  }

  const parsedProps = mosfetProps.parse(rawProps)

  expect(parsedProps.connections).toBeUndefined()
})

test("should parse mosfet schematic symbol port sides", () => {
  const rawProps: MosfetProps = {
    name: "M1",
    channelType: "n",
    mosfetMode: "enhancement",
    symbolDrainSide: "bottom",
    symbolSourceSide: "top",
    symbolGateSide: "right",
  }

  const parsedProps = mosfetProps.parse(rawProps)

  expect(parsedProps.symbolDrainSide).toBe("bottom")
  expect(parsedProps.symbolSourceSide).toBe("top")
  expect(parsedProps.symbolGateSide).toBe("right")
})

test("should reject invalid mosfet schematic symbol port sides", () => {
  expect(() =>
    mosfetProps.parse({
      name: "M1",
      channelType: "n",
      mosfetMode: "enhancement",
      symbolGateSide: "center",
    }),
  ).toThrow(z.ZodError)
})
