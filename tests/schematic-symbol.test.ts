import { expect, test } from "bun:test"
import { schematicSymbolProps } from "lib/components/schematic-symbol"

test("schematic symbol parses a physical component projection", () => {
  const parsed = schematicSymbolProps.parse({
    name: "A",
    displayName: "Q1A",
    chipRef: ".Q1",
    symbolName: "n_channel_e_mosfet_transistor",
    connections: {
      gate: ".Q1 > .G1",
      source: ".Q1 > .S1",
      drain: [".Q1 > .pin7", ".Q1 > .pin8"],
    },
    schX: "2mm",
    schY: "-1mm",
    schRotation: "90deg",
    schSectionName: "Switching",
    schSheetName: "Power",
  })

  expect(parsed).toEqual({
    name: "A",
    displayName: "Q1A",
    chipRef: ".Q1",
    symbolName: "n_channel_e_mosfet_transistor",
    connections: {
      gate: ".Q1 > .G1",
      source: ".Q1 > .S1",
      drain: [".Q1 > .pin7", ".Q1 > .pin8"],
    },
    schX: 2,
    schY: -1,
    schRotation: 90,
    schSectionName: "Switching",
    schSheetName: "Power",
  })
})

test("schematic symbol allows optional chipRef and connections", () => {
  const parsed = schematicSymbolProps.parse({
    name: "B",
    symbolName: "n_channel_e_mosfet_transistor",
  })

  expect(parsed.chipRef).toBeUndefined()
  expect(parsed.connections).toBeUndefined()
})

test("schematic symbol rejects an empty connections map", () => {
  expect(
    schematicSymbolProps.safeParse({
      name: "A",
      chipRef: ".Q1",
      symbolName: "n_channel_e_mosfet_transistor",
      connections: {},
    }).success,
  ).toBe(false)
})
