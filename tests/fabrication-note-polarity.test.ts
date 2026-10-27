import { expect, test } from "bun:test"
import {
  fabricationNotePathProps,
  type FabricationNotePathProps,
} from "lib/components/fabrication-note-path"
import {
  fabricationNoteTextProps,
  type FabricationNoteTextProps,
} from "lib/components/fabrication-note-text"

test("fabrication notes accept explicit polarity intent without inferring it from content", () => {
  const path: FabricationNotePathProps = {
    route: [
      { x: 0, y: 0 },
      { x: 0, y: 1 },
    ],
    isPolarityMarking: true,
  }
  const text: FabricationNoteTextProps = { text: "K", isPolarityMarking: true }
  const cases = [
    { schema: fabricationNotePathProps, props: path },
    { schema: fabricationNoteTextProps, props: text },
  ]
  for (const { schema, props } of cases) {
    for (const isPolarityMarking of [true, false, undefined]) {
      expect(
        schema.parse({ ...props, isPolarityMarking }).isPolarityMarking,
      ).toBe(isPolarityMarking)
    }
    expect(
      schema.safeParse({ ...props, isPolarityMarking: "true" }).success,
    ).toBe(false)
  }
  expect(
    fabricationNoteTextProps.parse({ text: "+" }).isPolarityMarking,
  ).toBeUndefined()
  expect(
    fabricationNoteTextProps.parse({ text: "-" }).isPolarityMarking,
  ).toBeUndefined()
})
