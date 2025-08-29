import { voltage } from "circuit-json"
import { z } from "zod"
import {
  commonComponentProps,
  lrPins,
  lrPolarPins,
  type CommonComponentProps,
} from "lib/common/layout"
import {
  schematicOrientation,
  type SchematicOrientation,
} from "lib/common/schematicOrientation"
import { expectTypesMatch } from "lib/typecheck"

/** @deprecated use battery_capacity from circuit-json when circuit-json is updated */
const capacity = z
  .number()
  .or(z.string().endsWith("mAh"))
  .transform((v) => {
    if (typeof v === "string") {
      const valString = v.replace("mAh", "")
      const num = Number.parseFloat(valString)
      if (Number.isNaN(num)) {
        throw new Error("Invalid capacity")
      }
      return num
    }
    return v
  })
  .describe("Battery capacity in mAh")

export interface BatteryProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  capacity?: number | string
  voltage?: number | string
  standard?: "AA" | "AAA" | "9V" | "CR2032" | "18650" | "C"
  schOrientation?: SchematicOrientation
}

export const batteryProps = commonComponentProps.extend({
  capacity: capacity.optional(),
  voltage: voltage.optional(),
  standard: z.enum(["AA", "AAA", "9V", "CR2032", "18650", "C"]).optional(),
  schOrientation: schematicOrientation.optional(),
})
export const batteryPins = lrPolarPins
export type BatteryPinLabels = (typeof batteryPins)[number]

expectTypesMatch<BatteryProps, z.input<typeof batteryProps>>(true)
