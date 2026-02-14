import { createConnectionsProp } from "lib/common/connectionsProp"
import {
  type CommonComponentProps,
  commonComponentProps,
  lrPolarPins,
} from "lib/common/layout"
import {
  type SchematicOrientation,
  schematicOrientation,
} from "lib/common/schematicOrientation"
import type { Connections } from "lib/utility-types/connections-and-selectors"
import { z } from "zod"

export type LedPinLabels = (typeof lrPolarPins)[number]

export interface LedProps extends Omit<CommonComponentProps, "name"> {
  name?: string
  color?: string
  wavelength?: string
  schDisplayValue?: string
  schOrientation?: SchematicOrientation
  connections?: Connections<LedPinLabels>
  laser?: boolean
}

export const ledProps = commonComponentProps.omit({ name: true }).extend({
  name: z.string().optional(),
  color: z.string().optional(),
  wavelength: z.string().optional(),
  schDisplayValue: z.string().optional(),
  schOrientation: schematicOrientation.optional(),
  connections: createConnectionsProp(lrPolarPins).optional(),
  laser: z.boolean().optional(),
})
export const ledPins = lrPolarPins
