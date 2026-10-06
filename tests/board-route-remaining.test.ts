import { expect, test } from "bun:test"
import { boardProps, type BoardProps } from "lib/components/board"

test("routeRemaining preserves explicit booleans without setting a default", () => {
  for (const routeRemaining of [true, false]) {
    const raw: BoardProps = { routeRemaining }
    expect(boardProps.parse(raw).routeRemaining).toBe(routeRemaining)
  }
  expect(boardProps.parse({}).routeRemaining).toBeUndefined()
  expect(
    boardProps.parse({ routeRemaining: undefined }).routeRemaining,
  ).toBeUndefined()
})

test("routeRemaining rejects non-boolean values", () => {
  for (const routeRemaining of ["true", "false", 0, 1, null, {}, []]) {
    expect(boardProps.safeParse({ routeRemaining }).success).toBe(false)
  }
})
