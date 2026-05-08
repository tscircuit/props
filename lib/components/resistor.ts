import { resistance } from "circuit-json"
import { createConnectionsProp } from "lib/common/connectionsProp"
import {
  type CommonComponentProps,
  commonComponentProps,
  lrPins,
} from "lib/common/layout"
import { footprintProp } from "lib/common/footprintProp"
import {
  schematicSymbolSize,
  type SchematicSymbolSize,
} from "lib/common/schematicSize"
import {
  schematicOrientation,
  type SchematicOrientation,
} from "lib/common/schematicOrientation"
import { expectTypesMatch } from "lib/typecheck"
import type { Connections } from "lib/utility-types/connections-and-selectors"
import { z } from "zod"

export const resistorPinLabels = ["pin1", "pin2", "pos", "neg"] as const
export type ResistorPinLabels = (typeof resistorPinLabels)[number]

export interface ResistorProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  resistance: number | string
  tolerance?: number | string
  pullupFor?: string
  pullupTo?: string
  pulldownFor?: string
  pulldownTo?: string
  schOrientation?: SchematicOrientation
  schSize?: SchematicSymbolSize
  connections?: Connections<ResistorPinLabels>
}

type ResistorFootprint = CommonComponentProps["footprint"]

const resistorImperialFootprintNames = new Set([
  "01005",
  "0201",
  "0402",
  "0504",
  "0603",
  "0805",
  "1206",
  "1210",
  "1812",
  "2010",
  "2512",
])

const mapResistorFootprint = (
  footprint: ResistorFootprint,
): ResistorFootprint => {
  if (typeof footprint !== "string") return footprint
  if (!resistorImperialFootprintNames.has(footprint)) return footprint
  return `res${footprint}`
}

const resistorFootprintProp: z.ZodType<ResistorFootprint> = footprintProp
  .optional()
  .transform(mapResistorFootprint)

export const resistorProps = commonComponentProps.extend({
  footprint: resistorFootprintProp,
  resistance,
  tolerance: z
    .union([z.string(), z.number()])
    .transform((val) => {
      if (typeof val === "string") {
        if (val.endsWith("%")) {
          return parseFloat(val.slice(0, -1)) / 100
        }
        return parseFloat(val)
      }
      return val
    })
    .pipe(
      z
        .number()
        .min(0, "Tolerance must be non-negative")
        .max(1, "Tolerance cannot be greater than 100%"),
    )
    .optional(),

  pullupFor: z.string().optional(),
  pullupTo: z.string().optional(),

  pulldownFor: z.string().optional(),
  pulldownTo: z.string().optional(),

  schOrientation: schematicOrientation.optional(),
  schSize: schematicSymbolSize.optional(),

  connections: createConnectionsProp(resistorPinLabels).optional(),
})
export const resistorPins = lrPins

type InferredResistorProps = z.input<typeof resistorProps>
expectTypesMatch<ResistorProps, InferredResistorProps>(true)
