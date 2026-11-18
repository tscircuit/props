import { expect, test } from "bun:test"
import {
  type AssemblyDrawingBomTableProps,
  type AssemblyDrawingHarnessViewProps,
  type AssemblyDrawingWiringTableProps,
  assemblyDrawingBomTableProps,
  assemblyDrawingHarnessViewProps,
  assemblyDrawingWiringTableProps,
  assemblyProps,
} from "lib"

test("assembly.drawing.harnessview places a flattened cable view like a part view", () => {
  expect(assemblyProps.drawing.harnessview).toBe(
    assemblyDrawingHarnessViewProps,
  )
  const view: AssemblyDrawingHarnessViewProps = {
    cableRef: " MOTOR_CABLE ",
    centerY: "40mm",
    width: 230,
    height: "76mm",
  }
  expect(assemblyDrawingHarnessViewProps.parse(view)).toEqual({
    cableRef: "MOTOR_CABLE",
    centerX: 0,
    centerY: 40,
    width: 230,
    height: 76,
    showBalloons: false,
  })
  expect(
    assemblyDrawingHarnessViewProps.parse({
      ...view,
      centerY: undefined,
      aboveRef: "TOP_VIEW",
      showBalloons: true,
    }),
  ).toMatchObject({ aboveRef: "TOP_VIEW", centerX: 0, showBalloons: true })
  for (const invalid of [
    { cableRef: " " },
    { cableRef: undefined },
    { width: 0 },
    { height: "wide" },
    { leftOfRef: "A", rightOfRef: "B" },
    { centerY: 40, belowRef: "A" },
  ])
    expect(
      assemblyDrawingHarnessViewProps.safeParse({ ...view, ...invalid })
        .success,
    ).toBe(false)
})

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
