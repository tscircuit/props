import { expect, test } from "bun:test"
import { boardProps, portProps, subcircuitProps } from "lib"

test("board schematic placement defaults to the sheet's legacy scale", () => {
  expect(subcircuitProps.parse({}).defaultSchematicLengthUnit).toBeUndefined()
  expect(
    subcircuitProps.parse({ defaultSchematicLengthUnit: "in" })
      .defaultSchematicLengthUnit,
  ).toBe("in")
  expect(
    boardProps.parse({ defaultSchematicLengthUnit: "in" })
      .defaultSchematicLengthUnit,
  ).toBe("in")
  const legacyUnit = `${10.16 / 1.1}mm`
  expect(boardProps.parse({}).defaultSchematicLengthUnit).toBe(legacyUnit)
  expect(
    boardProps.parse({ defaultSchematicLengthUnit: legacyUnit })
      .defaultSchematicLengthUnit,
  ).toBe(legacyUnit)
  expect(
    boardProps.parse({ defaultSchematicLengthUnit: "mm" })
      .defaultSchematicLengthUnit,
  ).toBe("mm")
  expect(
    boardProps.safeParse({ defaultSchematicLengthUnit: "unknown" }).success,
  ).toBe(false)
  expect(portProps.parse({ schX: "1in", schY: "-5mm" })).toMatchObject({
    schX: 25.4,
    schY: -5,
  })
})
