import { expect, test } from "bun:test"
import {
  assemblyDrawingPageProps,
  assemblyDrawingPartLabelProps,
  assemblyDrawingNoteProps,
} from "../lib"

test("drawing origins and annotation positions normalize units and reject conflicting axes", () => {
  expect(
    assemblyDrawingPageProps.parse({
      size: "iso_a4",
      origin: { x: "1cm", y: "2cm" },
    }),
  ).toMatchObject({ origin: { x: 10, y: 20 } })
  expect(
    assemblyDrawingPageProps.parse({ width: 200, height: 140 }).origin,
  ).toBeUndefined()
  expect(
    assemblyDrawingPageProps.safeParse({
      width: 200,
      height: 140,
      origin: { x: Infinity, y: 0 },
    }).success,
  ).toBe(false)
  const label = {
    text: "Rotor",
    partRefs: [".rotor"],
    anchor: { x: 0, y: 0, z: 0 },
  }
  expect(
    assemblyDrawingPartLabelProps.parse({
      ...label,
      xOffsetFromViewCenter: "-5cm",
      yOffsetFromViewCenter: "2cm",
    }),
  ).toMatchObject({ xOffsetFromViewCenter: -50, yOffsetFromViewCenter: 20 })
  expect(
    assemblyDrawingPartLabelProps.parse({
      ...label,
      paperX: "2cm",
      yOffsetFromViewCenter: "3mm",
    }),
  ).toMatchObject({ paperX: 20, yOffsetFromViewCenter: 3 })
  expect(
    assemblyDrawingNoteProps.parse({
      text: "Seat rotor",
      viewRef: " .join ",
      xOffsetFromViewCenter: 0,
      yOffsetFromViewCenter: "-4cm",
    }),
  ).toMatchObject({
    viewRef: ".join",
    xOffsetFromViewCenter: 0,
    yOffsetFromViewCenter: -40,
  })
  for (const position of [
    {},
    { paperX: 0 },
    { xOffsetFromViewCenter: 0 },
    { paperX: 0, paperY: 0, xOffsetFromViewCenter: 0 },
    { paperX: 0, paperY: 0, yOffsetFromViewCenter: 0 },
    { xOffsetFromViewCenter: NaN, yOffsetFromViewCenter: 0 },
    { paperX: 0, yOffsetFromViewCenter: Infinity },
  ]) {
    expect(
      assemblyDrawingPartLabelProps.safeParse({ ...label, ...position })
        .success,
    ).toBe(false)
    expect(
      assemblyDrawingNoteProps.safeParse({ text: "Note", ...position }).success,
    ).toBe(false)
  }
})
