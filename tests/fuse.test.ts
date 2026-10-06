import { expect, test } from "bun:test"
import { fuseProps, type FuseProps } from "lib/components/fuse"
import { z } from "zod"

test("should parse fuse props with single string connections", () => {
  const rawProps: FuseProps = {
    name: "F1",
    currentRating: "1A",
    connections: {
      pin1: "net.VCC",
      pin2: "net.GND",
    },
  }
  const parsedProps = fuseProps.parse(rawProps)
  expect(parsedProps.connections).toEqual({
    pin1: "net.VCC",
    pin2: "net.GND",
  })
})

test("should parse fuse props with array connections", () => {
  const rawProps: FuseProps = {
    name: "F2",
    currentRating: 2,
    connections: {
      pin1: ["net.VCC", "net.5V"],
      pin2: ["net.GND", "net.0V"],
    },
  }
  const parsedProps = fuseProps.parse(rawProps)
  expect(parsedProps.connections).toEqual({
    pin1: ["net.VCC", "net.5V"],
    pin2: ["net.GND", "net.0V"],
  })
})

test("should reject connections with invalid keys", () => {
  expect(() => {
    fuseProps.parse({
      name: "F3",
      currentRating: "1A",
      connections: {
        invalidKey: "net.INVALID",
        pin1: "net.VCC",
      } as any,
    })
  }).toThrow(z.ZodError)
})

test("should reject connections with a typo'd pin name", () => {
  expect(() => {
    fuseProps.parse({
      name: "F4",
      currentRating: "1A",
      connections: {
        pin99: ".R1 > .pin1",
      } as any,
    })
  }).toThrow(z.ZodError)
})

test("should reject connections with an empty string key", () => {
  expect(() => {
    fuseProps.parse({
      name: "F5",
      currentRating: "1A",
      connections: {
        "": ".R1 > .pin1",
      } as any,
    })
  }).toThrow(z.ZodError)
})

test("should allow optional connections", () => {
  const rawProps: FuseProps = {
    name: "F6",
    currentRating: "1A",
  }
  const parsedProps = fuseProps.parse(rawProps)
  expect(parsedProps.connections).toBeUndefined()
})
