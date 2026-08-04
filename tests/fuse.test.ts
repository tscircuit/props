import { expect, test } from "bun:test"
import { fuseProps, type FuseProps } from "lib/components/fuse"

test("should parse fuse connections keyed by pin labels", () => {
  const raw: FuseProps = {
    name: "F1",
    currentRating: "1A",
    connections: {
      pin1: "net.VCC",
      pin2: ["net.GND"],
    },
  }

  const parsed = fuseProps.parse(raw)
  expect(parsed.connections).toEqual({
    pin1: "net.VCC",
    pin2: ["net.GND"],
  })
})

test("should reject fuse connections keyed by an unknown pin", () => {
  const parsed = fuseProps.safeParse({
    name: "F1",
    currentRating: "1A",
    connections: { pin99: ".R1 > .pin1" },
  })

  expect(parsed.success).toBe(false)
})

test("should reject fuse connections keyed by an empty string", () => {
  const parsed = fuseProps.safeParse({
    name: "F1",
    currentRating: "1A",
    connections: { "": ".R1 > .pin1" },
  })

  expect(parsed.success).toBe(false)
})

test("should allow optional fuse connections", () => {
  const parsed = fuseProps.parse({
    name: "F1",
    currentRating: "1A",
  })

  expect(parsed.connections).toBeUndefined()
})
