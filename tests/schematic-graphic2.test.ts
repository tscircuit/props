import { expect, test } from "bun:test"
import { schematicGraphicProps } from "lib"

test("should require SVG content", () => {
  expect(() => schematicGraphicProps.parse({})).toThrow()
})
