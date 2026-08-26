import { expect, test } from "bun:test"
import { expectTypeOf } from "expect-type"
import { schematicGraphicProps, type SchematicGraphicProps } from "lib"

test("should parse an SVG schematic graphic", () => {
  const raw: SchematicGraphicProps = {
    svgContent:
      '<svg viewBox="0 0 100 50"><rect width="100" height="50" /></svg>',
  }

  expectTypeOf(raw).toMatchTypeOf<SchematicGraphicProps>()
  expect(schematicGraphicProps.parse(raw)).toEqual(raw)
})

test("should require SVG content", () => {
  expect(() => schematicGraphicProps.parse({})).toThrow()
})
