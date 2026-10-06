import { expect, test } from "bun:test"
import { schematicGraphicProps } from "lib"

test("should parse imageUrl and svgContent together", () => {
  const raw = {
    imageUrl: "https://example.com/system-block-diagram.svg",
    svgContent: '<svg viewBox="0 0 100 50" />',
  }

  expect(schematicGraphicProps.parse(raw)).toEqual(raw)
})
