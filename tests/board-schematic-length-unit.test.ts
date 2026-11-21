import { expect, test } from "bun:test"
import { boardProps, portProps } from "lib"

test("board schematic placement defaults to the sheet's legacy scale", () => {
  const legacyUnit = `${10.16 / 1.1}mm`
  expect(boardProps.parse({}).schematicLengthUnit).toBe(legacyUnit)
  expect(
    boardProps.parse({ schematicLengthUnit: legacyUnit }).schematicLengthUnit,
  ).toBe(legacyUnit)
  expect(
    boardProps.parse({ schematicLengthUnit: "mm" }).schematicLengthUnit,
  ).toBe("mm")
  expect(boardProps.safeParse({ schematicLengthUnit: "unknown" }).success).toBe(
    false,
  )
  expect(portProps.parse({ schX: "1in", schY: "-5mm" })).toMatchObject({
    schX: 25.4,
    schY: -5,
  })
})
