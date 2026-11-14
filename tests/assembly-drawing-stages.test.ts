import { expect, test } from "bun:test"
import {
  assemblyProps,
  assemblyDrawingStageProps,
  assemblyDrawingPartViewProps,
  assemblyDrawingExplosionViewProps,
  assemblyDrawingPartLabelProps,
  assemblyDrawingNoteProps,
} from "../lib"
test("drawing stage authoring parses unit distances and rejects ambiguous selection", () => {
  expect(assemblyProps.drawing.stage).toBe(assemblyDrawingStageProps)
  expect(assemblyProps.drawing).not.toHaveProperty("explosion")
  expect(assemblyProps.drawing.partlabel).toBe(assemblyDrawingPartLabelProps)
  expect(assemblyProps.drawing.note).toBe(assemblyDrawingNoteProps)
  expect(
    assemblyDrawingStageProps.parse({
      name: " rotor ",
      partRefs: [" .cap "],
      includeStageRefs: [".magnet"],
    }),
  ).toEqual({
    name: "rotor",
    partRefs: [".cap"],
    includeStageRefs: [".magnet"],
  })
  const view = {
    stageRef: "lift-rotor",
    direction: "isometric",
    width: 90,
    height: 80,
  }
  expect(assemblyDrawingExplosionViewProps.parse(view)).toMatchObject({
    stageRef: "lift-rotor",
    factor: 1,
    showTrails: false,
    centerX: 0,
    centerY: 0,
  })
  for (const patch of [
    { partRef: ".base" },
    { moves: [{ targetRefs: "rotor", offZ: "4cm" }] },
    { explosionRef: ".old-pose" },
    { centerX: 0, rightOfRef: ".other" },
    { aboveRef: ".other", belowRef: ".another" },
    { stageRef: undefined },
    { stageRef: undefined, partRef: ".base" },
  ])
    expect(
      assemblyDrawingExplosionViewProps.safeParse({ ...view, ...patch })
        .success,
    ).toBe(false)
  expect(assemblyProps.drawing.explosionview).toBe(
    assemblyDrawingExplosionViewProps,
  )
  expect(
    assemblyDrawingPartViewProps.safeParse({ ...view, factor: 1 }).success,
  ).toBe(false)
  expect(
    assemblyDrawingPartViewProps.parse({ ...view, stageRef: ".complete" }),
  ).toMatchObject({ stageRef: ".complete" })
  expect(
    assemblyDrawingExplosionViewProps.parse({
      ...view,
      stageRef: " rotor.lift-cap ",
      width: "9cm",
      rightOfRef: ".assembled",
    }),
  ).toMatchObject({
    stageRef: "rotor.lift-cap",
    width: 90,
    rightOfRef: ".assembled",
    centerY: 0,
  })
  expect(
    assemblyDrawingExplosionViewProps.parse({
      ...view,
      rightOfRef: ".assembled",
    }).centerX,
  ).toBeUndefined()
  for (const input of [
    { name: "empty" },
    { name: "empty", partRefs: [] },
    { name: "bad", boardRefs: [" "] },
  ])
    expect(assemblyDrawingStageProps.safeParse(input).success).toBe(false)
  expect(assemblyDrawingExplosionViewProps.parse(view)).not.toHaveProperty(
    "moves",
  )
  expect(
    assemblyDrawingExplosionViewProps.parse({ ...view, factor: 0 }).factor,
  ).toBe(0)
  for (const stageRef of ["", " ", null, 42])
    expect(
      assemblyDrawingExplosionViewProps.safeParse({ ...view, stageRef })
        .success,
    ).toBe(false)
  for (const moves of [
    [],
    [{ targetRefs: "rotor", offZ: "40mm" }],
    [{ offZ: 1 }],
    [{ partRefs: [".cap"] }],
    [{ partRefs: [".cap"], offZ: Infinity }],
  ])
    expect(
      assemblyDrawingExplosionViewProps.safeParse({ ...view, moves }).success,
    ).toBe(false)
  for (const factor of [-1, 2, NaN])
    expect(
      assemblyDrawingExplosionViewProps.safeParse({
        ...view,
        factor,
      }).success,
    ).toBe(false)
  expect(
    assemblyDrawingPartLabelProps.parse({
      text: "Cap",
      partRefs: [".cap"],
      anchor: { x: 0, y: 0, z: "2mm" },
      paperX: "6cm",
      paperY: "3cm",
    }),
  ).toMatchObject({ anchor: { x: 0, y: 0, z: 2 }, paperX: 60, paperY: 30 })
  expect(
    assemblyDrawingNoteProps.parse({
      text: "Seat rotor",
      paperX: 0,
      paperY: "4cm",
    }),
  ).toEqual({ text: "Seat rotor", paperX: 0, paperY: 40, fontSize: 2.7 })
  expect(
    assemblyDrawingNoteProps.safeParse({ text: " ", paperX: 0, paperY: 0 })
      .success,
  ).toBe(false)
  expect(
    assemblyDrawingNoteProps.safeParse({
      text: "Note",
      paperX: 0,
      paperY: 0,
      fontSize: 0,
    }).success,
  ).toBe(false)
})
