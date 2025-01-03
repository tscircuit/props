import { expect, test } from "bun:test"
import { chipProps, type ChipProps } from "lib/components/chip"
import type { z } from "zod"
import { expectTypeOf } from "expect-type"

test("should parse chip props", () => {
  const rawProps: ChipProps = {
    name: "chip",
    manufacturerPartNumber: "1234",
    pinLabels: {
      1: "1",
      2: "2",
      3: "3",
      4: "4",
    },
    schPortArrangement: {
      leftSize: 1,
      topSize: 2,
      rightSize: 3,
      bottomSize: 4,
    },
    schPinSpacing: "0.2mm",
    schWidth: 2,
    noSchematicRepresentation: true,
  }

  expectTypeOf(rawProps).toMatchTypeOf<z.input<typeof chipProps>>()

  const parsedProps = chipProps.parse(rawProps)

  expect(parsedProps.schPinSpacing).toBe(0.2)
  expect(parsedProps.noSchematicRepresentation).toBe(true)
})
