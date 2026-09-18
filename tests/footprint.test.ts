import { expect, test } from "bun:test"
import { footprintProps, type FootprintProps } from "lib/components/footprint"

test("should parse footprint name", () => {
  const raw: FootprintProps = { name: "U1_FOOTPRINT" }
  const parsed = footprintProps.parse(raw)
  expect(parsed.name).toBe("U1_FOOTPRINT")
})

test("should parse footprint insertionDirection options", () => {
  const insertionDirections = [
    "from_left",
    "from_right",
    "from_top",
    "from_bottom",
    "from_above",
    "from_below",
    "from_x_neg",
    "from_x_pos",
    "from_y_pos",
    "from_y_neg",
    "from_z_pos",
    "from_z_neg",
    "from_front",
    "from_back",
  ] as const

  for (const insertionDirection of insertionDirections) {
    const raw: FootprintProps = { insertionDirection }
    const parsed = footprintProps.parse(raw)
    expect(parsed.insertionDirection).toBe(insertionDirection)
  }
})

test("should fail for invalid footprint insertionDirection", () => {
  for (const insertionDirection of ["from_side", "from_y+", "from_beneath"]) {
    expect(() => footprintProps.parse({ insertionDirection } as any)).toThrow()
  }
})
