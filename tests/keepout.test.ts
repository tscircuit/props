import { expect, test } from "bun:test"
import { keepoutProps, type KeepoutProps } from "lib/components/keepout"

test("should parse keepout layer prop", () => {
  const rawProps: KeepoutProps = {
    shape: "rect",
    width: "5mm",
    height: "2mm",
    layer: "top",
  }

  const parsed = keepoutProps.parse(rawProps)

  expect(parsed.shape).toBe("rect")
  expect(parsed.layer).toBe("top")
})

test("should parse keepout layers prop", () => {
  const rawProps: KeepoutProps = {
    shape: "circle",
    radius: "1mm",
    layers: ["top", "bottom"],
  }

  const parsed = keepoutProps.parse(rawProps)

  expect(parsed.shape).toBe("circle")
  expect(parsed.layers).toEqual(["top", "bottom"])
})

test("should parse keepout excludeRefs selectors", () => {
  const rectProps: KeepoutProps = {
    shape: "rect",
    width: "5mm",
    height: "2mm",
    excludeRefs: [".ANT1", ".C1"],
  }
  const circleProps: KeepoutProps = {
    shape: "circle",
    radius: "1mm",
    excludeRefs: [".ANT1"],
  }

  expect(keepoutProps.parse(rectProps).excludeRefs).toEqual([".ANT1", ".C1"])
  expect(keepoutProps.parse(circleProps).excludeRefs).toEqual([".ANT1"])
})
