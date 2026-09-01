import { expect, test } from "bun:test"
import { ledProps, type LedProps } from "lib/components/led"

test("normalizes legacy numeric LED pin-label keys", () => {
  const rawProps: LedProps = {
    name: "LED1",
    pinLabels: {
      "1": "pos",
      "2": "neg",
    },
  }

  const parsedProps = ledProps.parse(rawProps)

  expect(parsedProps.pinLabels).toEqual({
    pin1: "pos",
    pin2: "neg",
  })
})
