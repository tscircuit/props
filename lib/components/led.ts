import { commonComponentProps, lrPolarPins } from "lib/common/layout"
import { schematicOrientation } from "lib/common/schematicOrientation"
import { z } from "zod"
import { createConnectionsProp } from "lib/common/connectionsProp"
import { diodePinLabelsProp } from "lib/components/diode"
import { schematicPinLabel } from "lib/common/schematicPinLabel"

export type LedPinLabels = (typeof lrPolarPins)[number]

const legacyNumericLedPinLabelsProp = z
  .record(
    z.enum(["1", "2"]),
    schematicPinLabel
      .or(z.array(schematicPinLabel).readonly())
      .or(z.array(schematicPinLabel)),
  )
  .transform((pinLabels) => ({
    ...(pinLabels["1"] === undefined ? {} : { pin1: pinLabels["1"] }),
    ...(pinLabels["2"] === undefined ? {} : { pin2: pinLabels["2"] }),
  }))

export const ledProps = commonComponentProps.extend({
  color: z.string().optional(),
  wavelength: z.string().optional(),
  schDisplayValue: z.string().optional(),
  schOrientation: schematicOrientation.optional(),
  // Numeric keys are accepted for compatibility with legacy generated LED
  // wrappers, then normalized to the canonical pin1/pin2 representation.
  pinLabels: diodePinLabelsProp.or(legacyNumericLedPinLabelsProp).optional(),
  connections: createConnectionsProp(lrPolarPins).optional(),
  laser: z.boolean().optional(),
})
export const ledPins = lrPolarPins
export type LedProps = z.input<typeof ledProps>
