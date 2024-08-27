import { z } from "zod"
import { commonComponentProps, lrPolarPins } from "../types/common"

export const diodeProps = commonComponentProps.extend({})
export const diodePins = lrPolarPins
export type DiodeProps = z.input<typeof diodeProps>
import { z } from "zod"
import { pcbLayoutProps } from "../types/common"
import { distance } from "@tscircuit/soup"
import { portHints } from "../utils/portHints"

export const platedHoleProps = z.union([
  pcbLayoutProps.omit({ pcbRotation: true, layer: true }).extend({
    shape: z.literal("circle"),
    holeDiameter: distance,
    outerDiameter: distance,
    portHints: portHints.optional(),
  }),
  pcbLayoutProps.omit({ pcbRotation: true, layer: true }).extend({
    shape: z.literal("oval"),
    outerWidth: distance,
    outerHeight: distance,
    innerWidth: distance,
    innerHeight: distance,
    portHints: portHints.optional(),
  }),
])
export type PlatedHoleProps = z.input<typeof platedHoleProps>
