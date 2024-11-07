import { expect, test } from "bun:test"
import { chipProps, type ChipProps } from "lib/components/chip"
import type { z } from "zod"
import { expectTypeOf } from "expect-type"

test("should parse chip props (number)", () => {
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
      leftSide: {
        pins: [29, 7, 8, 20, 19, 22],
        direction: "top-to-bottom",
      },
      topSide: {
        direction: "left-to-right",
        pins: [4, 18],
      },
      rightSide: {
        direction: "bottom-to-top",
        pins: [12, 13, 14, 15, 16, 17, 23],
      },
    },
    schPinSpacing: "0.2mm",
    schWidth: 2,
  }

  // expectTypeOf(rawProps).toMatchTypeOf<z.input<typeof chipProps>>()

  const parsedProps = chipProps.parse(rawProps)

  expect((parsedProps.schPortArrangement as any)?.leftSide.pins).toEqual([
    29, 7, 8, 20, 19, 22,
  ])
})

test("should parse chip props (string)", () => {
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
      leftSide: {
        pins: ["29", "7", "8", "20", "19", "22"],
        direction: "top-to-bottom",
      },
      topSide: {
        direction: "left-to-right",
        pins: ["A4", "B18"],
      },
    },
    schPinSpacing: "0.2mm",
    schWidth: 2,
  }

  const parsedProps = chipProps.parse(rawProps)

  expect((parsedProps.schPortArrangement as any)?.topSide.pins).toEqual([
    "A4", "B18",
  ])
})
