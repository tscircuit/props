import { expect, test } from "bun:test"
import { footprintProps, type FootprintProps } from "lib/components/footprint"

test("should parse footprint insertionDirection options", () => {
  const insertionDirections = [
    "from_above",
    "from_left",
    "from_right",
    "from_front",
    "from_back",
    "x+",
    "x-",
    "y+",
    "y-",
  ] as const

  for (const insertionDirection of insertionDirections) {
    const raw: FootprintProps = { insertionDirection }
    const parsed = footprintProps.parse(raw)
    expect(parsed.insertionDirection).toBe(insertionDirection)
  }
})

test("should fail for invalid footprint insertionDirection", () => {
  expect(() =>
    footprintProps.parse({
      insertionDirection: "from_side",
    } as any),
  ).toThrow()
})
