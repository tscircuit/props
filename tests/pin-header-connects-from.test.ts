import { expect, test } from "bun:test"
import { pinHeaderProps } from "lib/components/pin-header"

// `connectsFromAbove` / `connectsFromBelow` resolve to `layer` at parse time,
// so the dozens of places downstream that read `layer` need to know nothing
// about them. An alias only some consumers understand is worse than no alias.

test("connectsFromBelow resolves to layer bottom", () => {
  const parsed = pinHeaderProps.parse({
    name: "J1",
    pinCount: 4,
    connectsFromBelow: true,
  })
  expect(parsed.layer).toBe("bottom")
})

test("connectsFromAbove resolves to layer top", () => {
  const parsed = pinHeaderProps.parse({
    name: "J1",
    pinCount: 4,
    connectsFromAbove: true,
  })
  expect(parsed.layer).toBe("top")
})

test("an explicit layer wins over the alias", () => {
  const parsed = pinHeaderProps.parse({
    name: "J1",
    pinCount: 4,
    connectsFromBelow: true,
    layer: "top",
  })
  expect(parsed.layer).toBe("top")
})

test("layer is left alone when neither alias is given", () => {
  expect(
    pinHeaderProps.parse({ name: "J1", pinCount: 4 }).layer,
  ).toBeUndefined()
})

test("the two aliases are opposites, so both together is an error", () => {
  expect(() =>
    pinHeaderProps.parse({
      name: "J1",
      pinCount: 4,
      connectsFromAbove: true,
      connectsFromBelow: true,
    }),
  ).toThrow(/at most one/)
})
