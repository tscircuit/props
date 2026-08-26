import { expect, test } from "bun:test"
import {
  schematicSheetProps,
  type SchematicSheetProps,
} from "lib/components/schematic-sheet"
import { expectTypeOf } from "expect-type"

test("should parse schematic sheet with name, displayName, and children", () => {
  const raw: SchematicSheetProps = {
    name: "main",
    displayName: "Main Sheet",
    sheetIndex: 0,
    children: [{ type: "resistor", props: { name: "R1" } }],
  }

  expectTypeOf(raw).toMatchTypeOf<SchematicSheetProps>()
  const parsed = schematicSheetProps.parse(raw)
  expect(parsed.name).toBe("main")
  expect(parsed.displayName).toBe("Main Sheet")
  expect(parsed.sheetIndex).toBe(0)
  expect(parsed.sheetSize).toBe("A4")
  expect(parsed.children).toEqual([{ type: "resistor", props: { name: "R1" } }])
})

test("should parse ANSI B schematic sheet size", () => {
  const parsed = schematicSheetProps.parse({
    name: "power",
    displayName: "Power Sheet",
    sheetSize: "ANSI_B",
  })

  expect(parsed.sheetSize).toBe("ANSI_B")
})

test("should parse schematic sheet without children", () => {
  const raw: SchematicSheetProps = {
    name: "power",
    displayName: "Power Sheet",
  }

  const parsed = schematicSheetProps.parse(raw)
  expect(parsed.children).toBeUndefined()
})

test("should fail without displayName", () => {
  expect(() => schematicSheetProps.parse({ name: "main" })).toThrow()
})

test("should fail with an unsupported sheet size", () => {
  expect(() =>
    schematicSheetProps.parse({
      name: "main",
      displayName: "Main Sheet",
      sheetSize: "A3",
    }),
  ).toThrow()
})
