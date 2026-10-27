import { expect, test } from "bun:test"
import { assemblyDrawingPartViewProps } from "../lib"

test("drawing references preserve inferred axes and reject conflicting positions", () => {
  const view = {
    partRef: ".housing",
    direction: "z+" as const,
    width: 80,
    height: 60,
  }
  for (const ref of [
    "leftOfRef",
    "rightOfRef",
    "aboveRef",
    "belowRef",
  ] as const) {
    const horizontal = ref === "leftOfRef" || ref === "rightOfRef"
    const inferred = horizontal ? "centerX" : "centerY"
    const explicit = horizontal ? "centerY" : "centerX"
    const parsed = assemblyDrawingPartViewProps.parse({
      ...view,
      [ref]: " .plan ",
      [explicit]: "2cm",
    })
    expect(parsed[ref]).toBe(".plan")
    expect(parsed[inferred]).toBeUndefined()
    expect(parsed[explicit]).toBe(20)
    expect(
      assemblyDrawingPartViewProps.parse({ ...view, [ref]: ".plan" })[explicit],
    ).toBe(0)
    for (const invalid of ["", "   ", 123, null])
      expect(
        assemblyDrawingPartViewProps.safeParse({ ...view, [ref]: invalid })
          .success,
      ).toBe(false)
    expect(
      assemblyDrawingPartViewProps.safeParse({
        ...view,
        [ref]: ".plan",
        [inferred]: 0,
      }).success,
    ).toBe(false)
  }
  for (const refs of [
    { leftOfRef: ".plan", rightOfRef: ".other" },
    { aboveRef: ".plan", belowRef: ".other" },
  ])
    expect(
      assemblyDrawingPartViewProps.safeParse({ ...view, ...refs }).success,
    ).toBe(false)
  const relative = assemblyDrawingPartViewProps.parse({
    ...view,
    rightOfRef: ".plan",
    belowRef: ".section",
  })
  expect(relative.rightOfRef).toBe(".plan")
  expect(relative.belowRef).toBe(".section")
  expect(relative.centerX).toBeUndefined()
  expect(relative.centerY).toBeUndefined()
})
