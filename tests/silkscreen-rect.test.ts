import { expect, test } from "bun:test"
import { silkscreenRectProps } from "lib/components/silkscreen-rect"

test("leaves filled undefined when omitted", () => {
  const rect = silkscreenRectProps.parse({ width: 1, height: 1 })

  expect(rect.filled).toBeUndefined()
})
