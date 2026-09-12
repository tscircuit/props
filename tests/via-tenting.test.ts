import { expect, test } from "bun:test"
import { expectTypeOf } from "expect-type"
import { boardProps, type BoardProps } from "lib/components/board"
import { stampboardProps } from "lib/components/stampboard"
import { viaProps, type ViaProps } from "lib/components/via"
import type { z } from "zod"

test("board via tenting preserves modes and normalizes boolean shorthand", () => {
  for (const viaTenting of ["both", "top", "bottom", "none"] as const) {
    const raw: BoardProps = { viaTenting }
    expect(boardProps.parse(raw).viaTenting).toBe(viaTenting)
  }

  for (const [viaTenting, expected] of [
    [true, "both"],
    [false, "none"],
  ] as const) {
    const raw: BoardProps = { viaTenting }
    expect(boardProps.parse(raw).viaTenting).toBe(expected)
  }

  expectTypeOf<z.output<typeof boardProps>>().toMatchTypeOf<{
    viaTenting?: "both" | "top" | "bottom" | "none"
  }>()
})

test("omitted tenting stays unspecified for legacy behavior and inheritance", () => {
  expect(boardProps.parse({}).viaTenting).toBeUndefined()
  expect(boardProps.parse({ viaTenting: undefined }).viaTenting).toBeUndefined()
  expect(viaProps.parse({}).tented).toBeUndefined()
  expect(viaProps.parse({ tented: undefined }).tented).toBeUndefined()
})

test("via tenting preserves explicit booleans including false overrides", () => {
  for (const tented of [true, false]) {
    const raw: ViaProps = { name: "V1", tented }
    expect(viaProps.parse(raw).tented).toBe(tented)
  }
})

test("via tenting preserves independent top and bottom coverage", () => {
  for (const top of [true, false]) {
    for (const bottom of [true, false]) {
      const raw: ViaProps = { tented: { top, bottom } }
      expect(viaProps.parse(raw).tented).toEqual({ top, bottom })
    }
  }
})

test("board via tenting rejects invalid modes and nonboolean shorthand", () => {
  for (const viaTenting of [
    "all",
    "true",
    "false",
    "TOP",
    0,
    1,
    null,
    { top: true, bottom: false },
    [],
  ]) {
    expect(boardProps.safeParse({ viaTenting }).success).toBe(false)
  }
})

test("via tenting rejects incomplete sides and nonboolean coverage", () => {
  for (const tented of [
    "both",
    "true",
    0,
    1,
    null,
    [],
    {},
    { top: true },
    { bottom: false },
    { top: undefined, bottom: false },
    { top: true, bottom: "false" },
    { top: 1, bottom: false },
  ]) {
    expect(viaProps.safeParse({ tented }).success).toBe(false)
  }
})

test("stampboards retain board via tenting normalization", () => {
  expect(stampboardProps.parse({ viaTenting: true }).viaTenting).toBe("both")
  expect(stampboardProps.parse({ viaTenting: false }).viaTenting).toBe("none")
  expect(stampboardProps.parse({ viaTenting: "top" }).viaTenting).toBe("top")
  expect(stampboardProps.parse({}).viaTenting).toBeUndefined()
})
