import { expect, test } from "bun:test"
import { commonShapeProps } from "lib/common/commonShape"

test("common shape props contain the initial common shapes", () => {
  for (const shape of ["pill", "rect", "circle"] as const) {
    expect(commonShapeProps.parse({ shape })).toEqual({ shape })
  }
})

test("common shape props reject component-specific shapes", () => {
  expect(() => commonShapeProps.parse({ shape: "rounded_rect" })).toThrow()
})
