import { expect, test } from "bun:test"
import {
  pcbKeepoutProps,
  type PcbKeepoutProps,
} from "lib/components/pcb-keepout"

test("should parse keepout layer prop", () => {
  const rawProps: PcbKeepoutProps = {
    shape: "rect",
    width: "5mm",
    height: "2mm",
    layer: "top",
  }

  const parsed = pcbKeepoutProps.parse(rawProps)

  expect(parsed.shape).toBe("rect")
  expect(parsed.layer).toBe("top")
})

test("should parse keepout layers prop", () => {
  const rawProps: PcbKeepoutProps = {
    shape: "circle",
    radius: "1mm",
    layers: ["top", "bottom"],
  }

  const parsed = pcbKeepoutProps.parse(rawProps)

  expect(parsed.shape).toBe("circle")
  expect(parsed.layers).toEqual(["top", "bottom"])
})
