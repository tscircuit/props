import { expect, test } from "bun:test"
import { chipProps } from "lib/components/chip"

test("pinAttributes allows mustBeConnected", () => {
  const rawProps = {
    name: "chip",
    pinAttributes: {
      pin1: {
        mustBeConnected: true,
      },
      pin2: {
        mustBeConnected: false,
      },
    },
  }

  const parsed = chipProps.parse(rawProps)
  expect(parsed.pinAttributes?.pin1?.mustBeConnected).toBe(true)
  expect(parsed.pinAttributes?.pin2?.mustBeConnected).toBe(false)
})
