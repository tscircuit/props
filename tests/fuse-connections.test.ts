import { expect, test } from "bun:test"
import { capacitorProps } from "lib/components/capacitor"
import { fuseProps } from "lib/components/fuse"

const parseFuse = (connections: unknown) =>
  fuseProps.safeParse({ name: "F1", currentRating: "1A", connections })

test("fuse accepts its real pin labels in connections", () => {
  expect(parseFuse({ pin1: ".R1 > .pin1" }).success).toBe(true)
  expect(parseFuse({ pin2: ".R1 > .pin1" }).success).toBe(true)
  expect(parseFuse({ pin1: ".R1 > .pin1", pin2: ".R2 > .pin1" }).success).toBe(
    true,
  )
})

test("fuse rejects a pin label it does not have", () => {
  // Previously accepted: the schema used a bare z.record(z.string(), ...) so
  // any key at all passed, including a typo'd pin that the fuse has no port for.
  expect(parseFuse({ pin99: ".R1 > .pin1" }).success).toBe(false)
  expect(parseFuse({ "not a pin at all": ".R1 > .pin1" }).success).toBe(false)
  expect(parseFuse({ "": ".R1 > .pin1" }).success).toBe(false)
})

test("fuse validates connections the same way the other two-pin passives do", () => {
  // Same typo, same shape of component — these must agree.
  const typo = { pin99: ".R1 > .pin1" }

  expect(parseFuse(typo).success).toBe(
    capacitorProps.safeParse({
      name: "C1",
      capacitance: "1uF",
      connections: typo,
    }).success,
  )
})

test("fuse still accepts array and readonly-array connection targets", () => {
  expect(parseFuse({ pin1: [".R1 > .pin1", ".R2 > .pin1"] }).success).toBe(true)
  expect(
    parseFuse({ pin1: [".R1 > .pin1"] as readonly string[] }).success,
  ).toBe(true)
})

test("connections stays optional on fuse", () => {
  expect(fuseProps.safeParse({ name: "F1", currentRating: "1A" }).success).toBe(
    true,
  )
})
