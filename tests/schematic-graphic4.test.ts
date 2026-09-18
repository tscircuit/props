import { expect, test } from "bun:test"
import { schematicGraphicProps } from "lib"

test("should parse an image URL schematic graphic", () => {
  expect(
    schematicGraphicProps.parse({
      imageUrl: "https://example.com/system-block-diagram.svg",
      width: "8in",
      height: "4in",
    }),
  ).toEqual({
    imageUrl: "https://example.com/system-block-diagram.svg",
    width: 203.2,
    height: 101.6,
  })
})
