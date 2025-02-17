import { expect, test } from "bun:test"
import {
  stampboardProps,
  type StampboardProps,
} from "lib/components/stampboard"
import type { z } from "zod"
import { expectTypeOf } from "expect-type"

test("should parse stampboard props", () => {
  const rawProps: StampboardProps = {
    name: "stampboard",
    width: 50,
    height: 30,
    leftPins: 5,
    rightPins: 5,
    topPins: 3,
    bottomPins: 3,
    pitch: 2.54,
    innerHole: true,
  }

  expectTypeOf(rawProps).toMatchTypeOf<z.input<typeof stampboardProps>>()

  const parsedProps = stampboardProps.parse(rawProps)

  expect(parsedProps.width).toBe(50)
  expect(parsedProps.height).toBe(30)
  expect(parsedProps.innerHole).toBe(true)
})

test("should handle optional properties", () => {
  const rawProps: StampboardProps = {
    name: "stampboard",
    width: 100,
    height: 60,
  }

  const parsedProps = stampboardProps.parse(rawProps)

  expect(parsedProps.width).toBe(100)
  expect(parsedProps.height).toBe(60)
  expect(parsedProps.leftPins).toBeUndefined()
  expect(parsedProps.innerHole).toBeUndefined()
})

test("should parse numeric and string pitch values", () => {
  const rawProps1: StampboardProps = { name: "stampboard", pitch: 2.54 }
  const rawProps2: StampboardProps = { name: "stampboard", pitch: 2.54 }

  expect(stampboardProps.parse(rawProps1).pitch).toBe(2.54)
  expect(stampboardProps.parse(rawProps2).pitch).toBe(2.54)
})
