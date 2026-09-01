import { expect, test } from "bun:test"
import { footprintProps } from "../lib/components/footprint"

/**
 * Installation and enclosure interaction are independent part-local facts, but
 * deliberately share one direction vocabulary and parser.
 */
test("footprint parses cutoutApertureDirection independently of insertionDirection", () => {
  const parsed = footprintProps.parse({
    insertionDirection: "from_above",
    cutoutApertureDirection: "from_x_neg",
  })

  expect(parsed.insertionDirection).toBe("from_above")
  expect(parsed.cutoutApertureDirection).toBe("from_x_neg")
  expect(footprintProps.parse({}).cutoutApertureDirection).toBeUndefined()
  expect(() =>
    footprintProps.parse({ cutoutApertureDirection: "left" }),
  ).toThrow()
})
