import { commonComponentProps, lrPolarPins } from "lib/common/layout"
import {
  schematicOrientation,
  type SchematicOrientation,
} from "lib/common/schematicOrientation"
import { z } from "zod"

export const ledProps = commonComponentProps.extend({
  color: z.string().optional(),
  wavelength: z.string().optional(),
  schDisplayValue: z.string().optional(),
  schOrientation: schematicOrientation.optional(),
})
export const ledPins = lrPolarPins
export type LedProps = z.input<typeof ledProps>
