import { expect, test } from "bun:test"
import {
  schematicSectionProps,
  type SchematicSectionProps,
} from "lib/components/schematic-section"
import { expectTypeOf } from "expect-type"

test("should parse schematic section children", () => {
  const raw: SchematicSectionProps = {
    name: "power",
    displayName: "Power",
    children: [{ type: "resistor", props: { name: "R1" } }],
  }

  expectTypeOf(raw).toMatchTypeOf<SchematicSectionProps>()
  const parsed = schematicSectionProps.parse(raw)
  expect(parsed.children).toEqual([{ type: "resistor", props: { name: "R1" } }])
})
