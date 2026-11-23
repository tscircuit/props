import { expect, test } from "bun:test"
import { boardProps } from "lib/components/board"

test("board routing layers use the same layer references as buses", () => {
  expect(
    boardProps.parse({ layers: 4, routingLayers: ["top", { name: "inner2" }] })
      .routingLayers,
  ).toEqual(["top", "inner2"])
  expect(boardProps.parse({ layers: 4 }).routingLayers).toBeUndefined()
  expect(boardProps.safeParse({ layers: 4, routingLayers: [] }).success).toBe(
    false,
  )
})
