import { expect, test } from "bun:test"
import { expectTypeOf } from "expect-type"
import { holeProps, type HoleProps } from "../lib/components/hole"
import type { z } from "zod"

test("circle holes compute missing diameter and accept pcbRotation", () => {
  const raw: HoleProps = {
    radius: 2,
    pcbRotation: 90,
  }

  expectTypeOf(raw).toMatchTypeOf<z.input<typeof holeProps>>()

  const parsed = holeProps.parse(raw)

  if (parsed.shape === undefined || parsed.shape === "circle") {
    expect(parsed.radius).toBe(2)
    expect(parsed.diameter).toBe(4)
    expect(parsed.pcbRotation).toBe(90)
  } else {
    throw new Error("Expected circle hole props")
  }
})

test("pill holes require width and height", () => {
  const raw: HoleProps = {
    shape: "pill",
    width: "4mm",
    height: "1.5mm",
    name: "slot",
  }

  expectTypeOf(raw).toMatchTypeOf<z.input<typeof holeProps>>()

  const parsed = holeProps.parse(raw)

  if (parsed.shape === "pill") {
    expect(parsed.width).toBe(4)
    expect(parsed.height).toBe(1.5)
    expect(parsed.name).toBe("slot")
  } else {
    throw new Error("Expected pill hole props")
  }
})

test("pill holes without required dimensions throw", () => {
  const raw = {
    shape: "pill",
    width: "4mm",
  }

  expect(() => holeProps.parse(raw)).toThrow()
})
