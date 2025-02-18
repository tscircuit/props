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
    leftPinCount: 5,
    rightPinCount: 5,
    topPinCount: 3,
    bottomPinCount: 3,
    pinPitch: 2.54,
    innerHoles: true,
  }

  expectTypeOf(rawProps).toMatchTypeOf<z.input<typeof stampboardProps>>()

  const parsedProps = stampboardProps.parse(rawProps)

  expect(parsedProps.width).toBe(50)
  expect(parsedProps.height).toBe(30)
  expect(parsedProps.innerHoles).toBe(true)
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
  expect(parsedProps.innerHoles).toBeUndefined()
})

test("should parse numeric and string pitch values", () => {
  const rawProps1: StampboardProps = { name: "stampboard", pinPitch: 2.54 }
  const rawProps2: StampboardProps = { name: "stampboard", pinPitch: 2.54 }

  expect(stampboardProps.parse(rawProps1).pinPitch).toBe(2.54)
  expect(stampboardProps.parse(rawProps2).pinPitch).toBe(2.54)
})
