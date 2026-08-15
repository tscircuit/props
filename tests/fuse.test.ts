import { expect, test } from "bun:test"
import { fuseProps, type FuseProps } from "lib/components/fuse"

test("should parse fuse props with valid pin connections", () => {
  const rawProps: FuseProps = {
    name: "F1",
    currentRating: "1A",
    connections: {
      pin1: ".R1 > .pin1",
      pin2: "net.GND",
    },
  }

  const parsed = fuseProps.parse(rawProps)
  expect(parsed.connections).toEqual({
    pin1: ".R1 > .pin1",
    pin2: "net.GND",
  })
})

test("should reject unknown connection keys on fuse props (#754)", () => {
  expect(
    fuseProps.safeParse({
      name: "F1",
      currentRating: "1A",
      connections: { pin99: ".R1 > .pin1" as any },
    }).success,
  ).toBe(false)

  expect(
    fuseProps.safeParse({
      name: "F1",
      currentRating: "1A",
      connections: { "not a pin": ".R1 > .pin1" as any },
    }).success,
  ).toBe(false)

  expect(
    fuseProps.safeParse({
      name: "F1",
      currentRating: "1A",
      connections: { "": ".R1 > .pin1" as any },
    }).success,
  ).toBe(false)
})

test("should allow optional connections on fuse props", () => {
  const rawProps: FuseProps = {
    name: "F1",
    currentRating: "1A",
  }

  const parsed = fuseProps.parse(rawProps)
  expect(parsed.connections).toBeUndefined()
})
