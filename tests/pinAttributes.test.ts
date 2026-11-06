import { expect, test } from "bun:test"
import { chipProps } from "lib/components/chip"

test("pinAttributes allows doNotConnect", () => {
  const rawProps = {
    name: "chip",
    pinAttributes: {
      pin1: {
        doNotConnect: true,
        includeInBoardPinout: false,
        highlightColor: "#ff0000",
      },
    },
  }

  const parsed = chipProps.parse(rawProps)
  expect(parsed.pinAttributes?.pin1?.doNotConnect).toBe(true)
  expect(parsed.pinAttributes?.pin1?.includeInBoardPinout).toBe(false)
  expect(parsed.pinAttributes?.pin1?.highlightColor).toBe("#ff0000")
})

test("pinAttributes rejects unknown or misspelled attribute keys", () => {
  expect(() =>
    chipProps.parse({
      name: "chip",
      pinAttributes: {
        pin1: {
          isUsingInternalPullupp: true,
        },
      },
    }),
  ).toThrow()

  expect(() =>
    chipProps.parse({
      name: "chip",
      pinAttributes: {
        pin1: {
          is_output: true,
        },
      },
    }),
  ).toThrow()
})
