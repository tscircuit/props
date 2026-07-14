import { expect, test } from "bun:test"
import { commonShapeProps } from "lib/common/commonShape"

test("common shape props contain the initial common shapes", () => {
  expect(commonShapeProps.options).toEqual(["pill", "rect", "circle"])

  for (const shape of commonShapeProps.options) {
    expect(commonShapeProps.parse(shape)).toBe(shape)
  }
})

test("common shape props reject component-specific shapes", () => {
  expect(() => commonShapeProps.parse("rounded_rect")).toThrow()
})
