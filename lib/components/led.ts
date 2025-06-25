import { commonComponentProps, lrPolarPins } from "lib/common/layout"
import {
  schematicOrientation,
  type SchematicOrientation,
} from "lib/common/schematicOrientation"
import { z } from "zod"
import { createConnectionsProp } from "lib/common/connectionsProp"
import type { Connections } from "lib/utility-types/connections-and-selectors"

export type LedPinLabels = (typeof lrPolarPins)[number]

export const ledProps = commonComponentProps.extend({
  color: z.string().optional(),
  wavelength: z.string().optional(),
  schDisplayValue: z.string().optional(),
  schOrientation: schematicOrientation.optional(),
  connections: createConnectionsProp(lrPolarPins).optional(),
})
export const ledPins = lrPolarPins
export type LedProps = z.input<typeof ledProps>
