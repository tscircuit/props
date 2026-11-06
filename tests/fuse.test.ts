import { expect, test } from "bun:test"
import { type FuseProps, fuseProps } from "lib/components/fuse"

test("should parse fuse props with valid pin1 and pin2 connections", () => {
  const rawProps: FuseProps = {
    name: "F1",
    currentRating: "2A",
    voltageRating: "250V",
    connections: {
      pin1: "net.VIN",
      pin2: ["net.VOUT", ".R1 > .pin1"],
    },
  }

  const parsed = fuseProps.parse(rawProps)
  expect(parsed.connections).toEqual({
    pin1: "net.VIN",
    pin2: ["net.VOUT", ".R1 > .pin1"],
  })
})

test("should reject invalid connection keys on fuseProps", () => {
  expect(() =>
    fuseProps.parse({
      name: "F1",
      currentRating: "1A",
      connections: {
        pin99: ".R1 > .pin1",
      },
    }),
  ).toThrow()
})
