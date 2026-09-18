import { expect, test } from "bun:test"
import { boardProps } from "lib/components/board"

test("should default blind and buried autorouter vias to disabled", () => {
  const parsed = boardProps.parse({ name: "board", layers: 4 })

  expect(parsed.allowBlindAndBuriedVias).toBe(false)
})
