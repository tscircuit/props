import { expect, test } from "bun:test"
import { expectTypeOf } from "expect-type"
import {
  boardProps,
  stampboardProps,
  viaProps,
  type BoardProps,
  type ViaProps,
} from "lib"
import type { z } from "zod"

const tentingCases = [
  [true, "top_and_bottom_tented"],
  [false, "exposed"],
  ["both_sides", "top_and_bottom_tented"],
  ["top_and_bottom_tented", "top_and_bottom_tented"],
  ["top_tented", "top_tented"],
  ["bottom_tented", "bottom_tented"],
  ["exposed", "exposed"],
] as const

test("board and via tenting accept the same modes and normalize aliases", () => {
  for (const [input, expected] of tentingCases) {
    const board: BoardProps = { defaultViaTenting: input }
    const via: ViaProps = { tented: input }
    expect(boardProps.parse(board).defaultViaTenting).toBe(expected)
    expect(viaProps.parse(via).tented).toBe(expected)
  }

  expectTypeOf<BoardProps["defaultViaTenting"]>().toEqualTypeOf<
    ViaProps["tented"]
  >()
  expectTypeOf<
    z.output<typeof boardProps>["defaultViaTenting"]
  >().toEqualTypeOf<
    | "top_and_bottom_tented"
    | "top_tented"
    | "bottom_tented"
    | "exposed"
    | undefined
  >()
  expectTypeOf<z.output<typeof viaProps>["tented"]>().toEqualTypeOf<
    z.output<typeof boardProps>["defaultViaTenting"]
  >()
})

test("omitted tenting stays unspecified for board inheritance", () => {
  expect(boardProps.parse({}).defaultViaTenting).toBeUndefined()
  expect(
    boardProps.parse({ defaultViaTenting: undefined }).defaultViaTenting,
  ).toBeUndefined()
  expect(viaProps.parse({}).tented).toBeUndefined()
  expect(viaProps.parse({ tented: undefined }).tented).toBeUndefined()
})

test("explicit false remains an exposed override instead of unspecified", () => {
  expect(boardProps.parse({ defaultViaTenting: false }).defaultViaTenting).toBe(
    "exposed",
  )
  expect(viaProps.parse({ tented: false }).tented).toBe("exposed")
})

test("board and via tenting reject unsupported modes and object inputs", () => {
  for (const input of [
    "both",
    "top",
    "bottom",
    "none",
    "all",
    "true",
    "false",
    "TOP",
    0,
    1,
    null,
    [],
    {},
    { top: true, bottom: false },
    { top: true },
    { bottom: false },
  ]) {
    expect(boardProps.safeParse({ defaultViaTenting: input }).success).toBe(
      false,
    )
    expect(viaProps.safeParse({ tented: input }).success).toBe(false)
  }
})

test("stampboards inherit the same default via tenting schema", () => {
  for (const [input, expected] of tentingCases) {
    expect(
      stampboardProps.parse({ defaultViaTenting: input }).defaultViaTenting,
    ).toBe(expected)
  }
  expect(stampboardProps.parse({}).defaultViaTenting).toBeUndefined()
})
