import { commonComponentProps, lrPolarPins } from "lib/common/layout"
import { schematicOrientation } from "lib/common/schematicOrientation"
import { z } from "zod"
import { createConnectionsProp } from "lib/common/connectionsProp"

export type LedPinLabels = (typeof lrPolarPins)[number]

export const ledProps = commonComponentProps.extend({
  color: z.string().optional(),
  wavelength: z.string().optional(),
  schDisplayValue: z.string().optional(),
  schOrientation: schematicOrientation.optional(),
  connections: createConnectionsProp(lrPolarPins).optional(),
  laser: z.boolean().optional(),
  mfn: z.string().optional(),
})
export const ledPins = lrPolarPins
export type LedProps = z.input<typeof ledProps>
