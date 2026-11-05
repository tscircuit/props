import { chipProps, type ChipProps } from "../lib/components/chip"
import { expect, test } from "bun:test"
import {
  kicadFootprintMetadata,
  type KicadFootprintMetadata,
} from "../lib/common/kicadFootprintMetadata"
import {
  kicadSymbolMetadata,
  type KicadSymbolMetadata,
} from "../lib/common/kicadSymbolMetadata"

const footprintMetadata = {
  properties: {
    Value: { value: "MyPart" },
    Max_Current_A: {
      value: "6.4",
      hide: true,
      at: { x: "2mm", y: 3, rotation: "90deg" },
      layer: "F.Fab",
      uuid: "custom-property-uuid",
      effects: { font: { size: { x: "1mm", y: 1 }, thickness: "0.15mm" } },
    },
    Empty: { value: "" },
  },
} satisfies KicadFootprintMetadata

const symbolMetadata = {
  properties: {
    Value: { value: "MyPart" },
    Max_Current_A: {
      value: "6.4",
      id: "7",
      at: { x: "2mm", y: 3, rotation: "90deg" },
      effects: {
        hide: true,
        justify: ["left", "bottom"],
        font: { size: { x: "1mm", y: 1 }, thickness: "0.15mm" },
      },
    },
    Empty: { value: "" },
  },
} satisfies KicadSymbolMetadata

test("footprint metadata preserves and validates arbitrary property names", () => {
  const parsed = kicadFootprintMetadata.parse(footprintMetadata)
  expect(parsed.properties?.Value).toEqual({ value: "MyPart" })
  expect(parsed.properties?.Max_Current_A).toEqual({
    ...footprintMetadata.properties?.Max_Current_A,
    at: { x: 2, y: 3, rotation: 90 },
    effects: { font: { size: { x: 1, y: 1 }, thickness: 0.15 } },
  })
  expect(parsed.properties?.Empty).toEqual({ value: "" })
})

test("symbol metadata preserves and validates arbitrary property names", () => {
  const parsed = kicadSymbolMetadata.parse(symbolMetadata)
  expect(parsed.properties?.Value).toEqual({ value: "MyPart" })
  expect(parsed.properties?.Max_Current_A).toEqual({
    ...symbolMetadata.properties?.Max_Current_A,
    at: { x: 2, y: 3, rotation: 90 },
    effects: {
      hide: true,
      justify: ["left", "bottom"],
      font: { size: { x: 1, y: 1 }, thickness: 0.15 },
    },
  })
  expect(parsed.properties?.Empty).toEqual({ value: "" })
})

for (const schema of [kicadFootprintMetadata, kicadSymbolMetadata]) {
  test(`${schema === kicadFootprintMetadata ? "footprint" : "symbol"} custom properties reject malformed inputs`, () => {
    for (const property of [
      null,
      "6.4",
      {},
      { value: 6.4 },
      { value: "6.4", effects: { font: { size: { x: false, y: 1 } } } },
    ]) {
      const parsed = schema.safeParse({
        properties: { Max_Current_A: property },
      })
      expect(parsed.success).toBe(false)
      if (!parsed.success) {
        expect(parsed.error.issues[0]?.path).toContain("Max_Current_A")
      }
    }
    expect(schema.parse({})).toEqual({})
    expect(schema.parse({ properties: {} })).toEqual({ properties: {} })
  })
}

test("chip props accept custom metadata without type escapes", () => {
  const chip = {
    name: "U1",
    kicadFootprintMetadata: footprintMetadata,
    kicadSymbolMetadata: symbolMetadata,
  } satisfies ChipProps
  const parsed = chipProps.parse(chip)
  expect(parsed.kicadFootprintMetadata?.properties?.Max_Current_A?.value).toBe(
    "6.4",
  )
  expect(parsed.kicadSymbolMetadata?.properties?.Max_Current_A?.value).toBe(
    "6.4",
  )
})

test("built-in properties stay named and validated alongside custom properties", () => {
  for (const [schema, propertyNames] of [
    [
      kicadFootprintMetadata,
      ["Reference", "Value", "Datasheet", "Description"],
    ],
    [
      kicadSymbolMetadata,
      [
        "Reference",
        "Value",
        "Footprint",
        "Datasheet",
        "Description",
        "ki_keywords",
        "ki_fp_filters",
      ],
    ],
  ] as const) {
    const properties = Object.fromEntries(
      propertyNames.map((propertyName) => [
        propertyName,
        { value: String(propertyName) },
      ]),
    )
    properties.Max_Current_A = { value: "6.4" }
    expect(schema.parse({ properties }).properties).toEqual(properties)
    expect(Object.keys(schema.shape.properties.unwrap().shape)).toEqual([
      ...propertyNames,
    ])
    for (const propertyName of propertyNames) {
      expect(
        schema.safeParse({ properties: { [propertyName]: { value: 6.4 } } })
          .success,
      ).toBe(false)
    }
  }
})
