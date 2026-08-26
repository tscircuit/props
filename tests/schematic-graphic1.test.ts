import { expect, test } from "bun:test"
import { expectTypeOf } from "expect-type"
import { schematicGraphicProps, type SchematicGraphicProps } from "lib"

test("should parse an SVG schematic graphic", () => {
  const raw: SchematicGraphicProps = {
    svgContent:
      '<svg viewBox="0 0 100 50"><rect width="100" height="50" /></svg>',
    width: "100mm",
    height: 50,
  }

  expectTypeOf(raw).toMatchTypeOf<SchematicGraphicProps>()
  expect(schematicGraphicProps.parse(raw)).toEqual({
    svgContent: raw.svgContent,
    width: 100,
    height: 50,
  })
})
