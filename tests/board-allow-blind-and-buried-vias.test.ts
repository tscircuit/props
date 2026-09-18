import { expect, test } from "bun:test"
import { type BoardProps, boardProps } from "lib/components/board"

test("should allow blind and buried autorouter vias when enabled", () => {
  const raw: BoardProps = {
    name: "board",
    layers: 4,
    allowBlindAndBuriedVias: true,
  }

  const parsed = boardProps.parse(raw)

  expect(parsed.allowBlindAndBuriedVias).toBe(true)
})
