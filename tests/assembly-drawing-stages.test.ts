import { expect, test } from "bun:test"
import {
  assemblyProps,
  assemblyDrawingStageProps,
  assemblyDrawingExplosionProps,
  assemblyDrawingPartViewProps,
  assemblyDrawingExplosionViewProps,
  assemblyDrawingPartLabelProps,
  assemblyDrawingNoteProps,
} from "../lib"
test("drawing stage authoring parses unit distances and rejects ambiguous selection", () => {
  expect(assemblyProps.drawing.stage).toBe(assemblyDrawingStageProps)
  expect(assemblyProps.drawing.explosion).toBe(assemblyDrawingExplosionProps)
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
  expect(
    assemblyDrawingExplosionProps.parse({
      name: "join",
      moves: [{ includeStageRefs: [".rotor"], offZ: "4cm" }],
    }),
  ).toEqual({
    name: "join",
    factor: 1,
    showTrails: false,
    moves: [{ includeStageRefs: [".rotor"], offX: 0, offY: 0, offZ: 40 }],
  })
  const view = {
    stageRef: ".complete",
    explosionRef: ".join",
    direction: "isometric",
    width: 90,
    height: 80,
  }
  expect(assemblyDrawingExplosionViewProps.parse(view)).toMatchObject({
    stageRef: ".complete",
    explosionRef: ".join",
    centerX: 0,
    centerY: 0,
  })
  for (const patch of [
    { partRef: ".base" },
    { explosionRef: undefined },
    { explosionRef: " " },
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
  expect(assemblyDrawingPartViewProps.safeParse(view).success).toBe(false)
  expect(
    assemblyDrawingPartViewProps.parse({ ...view, explosionRef: undefined }),
  ).toMatchObject({ stageRef: ".complete" })
  expect(
    assemblyDrawingExplosionViewProps.parse({
      ...view,
      stageRef: " .complete ",
      explosionRef: " .join ",
      width: "9cm",
      rightOfRef: ".assembled",
    }),
  ).toMatchObject({
    stageRef: ".complete",
    explosionRef: ".join",
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
  for (const moves of [
    [],
    [{ offZ: 1 }],
    [{ partRefs: [".cap"] }],
    [{ partRefs: [".cap"], offZ: Infinity }],
  ])
    expect(
      assemblyDrawingExplosionProps.safeParse({ name: "e", moves }).success,
    ).toBe(false)
  for (const factor of [-1, 2, NaN])
    expect(
      assemblyDrawingExplosionProps.safeParse({
        name: "e",
        factor,
        moves: [{ partRefs: [".cap"], offZ: 0 }],
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
