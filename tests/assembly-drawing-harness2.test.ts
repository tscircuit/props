import { expect, test } from "bun:test"
import {
  type AssemblyDrawingBomTableProps,
  type AssemblyDrawingWiringTableProps,
  assemblyDrawingBomTableProps,
  assemblyDrawingWiringTableProps,
  assemblyProps,
} from "lib"

test("assembly.drawing.wiringtable and bomtable require an explicit anchor", () => {
  expect(assemblyProps.drawing.wiringtable).toBe(
    assemblyDrawingWiringTableProps,
  )
  expect(assemblyProps.drawing.bomtable).toBe(assemblyDrawingBomTableProps)
  const wiring: AssemblyDrawingWiringTableProps = {
    cableRef: "MOTOR_CABLE",
    title: "Wiring",
    paperX: "210mm",
    paperY: 96,
    anchorAlignment: "top_left",
  }
  expect(assemblyDrawingWiringTableProps.parse(wiring)).toEqual({
    cableRef: "MOTOR_CABLE",
    title: "Wiring",
    paperX: 210,
    paperY: 96,
    anchorAlignment: "top_left",
  })
  const bom: AssemblyDrawingBomTableProps = {
    paperX: 5,
    paperY: "5mm",
    anchorAlignment: "bottom_left",
  }
  expect(assemblyDrawingBomTableProps.parse(bom)).toEqual({
    paperX: 5,
    paperY: 5,
    anchorAlignment: "bottom_left",
  })
  expect(
    assemblyDrawingBomTableProps.parse({ ...bom, partRef: " MOTOR_CABLE " })
      .partRef,
  ).toBe("MOTOR_CABLE")
  for (const invalid of [
    { cableRef: "" },
    { title: " " },
    { paperX: undefined },
    { paperY: Number.NaN },
    { anchorAlignment: undefined },
    { anchorAlignment: "left" },
  ])
    expect(
      assemblyDrawingWiringTableProps.safeParse({ ...wiring, ...invalid })
        .success,
    ).toBe(false)
  for (const invalid of [
    { partRef: " " },
    { paperY: undefined },
    { anchorAlignment: undefined },
  ])
    expect(
      assemblyDrawingBomTableProps.safeParse({ ...bom, ...invalid }).success,
    ).toBe(false)
})
