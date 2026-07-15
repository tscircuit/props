import { expect, test } from "bun:test"
import { commonShapeProps, type CommonShapeProps } from "lib/common/commonShape"

test("common shape props contain discriminated shape geometry", () => {
  expect(
    commonShapeProps.parse({ shape: "rect", width: "4mm", height: "2mm" }),
  ).toEqual({ shape: "rect", width: 4, height: 2 })
  expect(
    commonShapeProps.parse({ shape: "pill", width: "6mm", height: "3mm" }),
  ).toEqual({ shape: "pill", width: 6, height: 3 })
  expect(commonShapeProps.parse({ shape: "circle", radius: "1.5mm" })).toEqual({
    shape: "circle",
    radius: 1.5,
  })
})

test("common shape props require geometry for each discriminator", () => {
  expect(() => commonShapeProps.parse({ shape: "rect" })).toThrow()
  expect(() => commonShapeProps.parse({ shape: "pill" })).toThrow()
  expect(() => commonShapeProps.parse({ shape: "circle" })).toThrow()
})

test("CommonShapeProps narrows to shape-specific geometry", () => {
  const shape: CommonShapeProps = {
    shape: "rect",
    width: 4,
    height: 2,
  }

  if (shape.shape === "rect") {
    expect(shape.width).toBe(4)
    expect(shape.height).toBe(2)
  }
})

test("common shape props reject component-specific shapes", () => {
  expect(() => commonShapeProps.parse({ shape: "rounded_rect" })).toThrow()
})
