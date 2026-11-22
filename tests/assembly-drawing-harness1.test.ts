import { expect, test } from "bun:test"
import {
  type AssemblyDrawingHarnessViewProps,
  assemblyDrawingHarnessViewProps,
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
