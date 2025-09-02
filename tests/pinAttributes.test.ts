import { expect, test } from "bun:test"
import { chipProps } from "lib/components/chip"

test("pinAttributes allows doNotConnect", () => {
  const rawProps = {
    name: "chip",
    pinAttributes: {
      pin1: { doNotConnect: true },
    },
  }

  const parsed = chipProps.parse(rawProps)
  expect(parsed.pinAttributes?.pin1?.doNotConnect).toBe(true)
})
