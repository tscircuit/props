import { expect, test } from "bun:test"
import { schematicGraphicProps } from "lib"

test("should parse a static-file import shaped imageUrl", () => {
  expect(
    schematicGraphicProps.parse({
      imageUrl: { default: "/assets/system-block-diagram.svg" },
    }),
  ).toEqual({
    imageUrl: "/assets/system-block-diagram.svg",
  })
})
