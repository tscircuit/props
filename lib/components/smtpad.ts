import {
  pcbLayoutProps,
  type CommonLayoutProps,
  type PcbLayoutProps,
} from "lib/common/layout"
import { z } from "zod"
import { distance, type Distance } from "lib/common/distance"
import { portHints, type PortHints } from "lib/common/portHints"
import { expectTypesMatch } from "lib/typecheck"

export interface RectSmtPadProps extends Omit<PcbLayoutProps, "pcbRotation"> {
  shape: "rect"
  width: Distance
  height: Distance
  portHints?: PortHints
}

export interface CircleSmtPadProps extends Omit<PcbLayoutProps, "pcbRotation"> {
  shape: "circle"
  radius: Distance
  portHints?: PortHints
}

export type SmtPadProps = RectSmtPadProps | CircleSmtPadProps

// ----------------------------------------------------------------------------
// Zod
// ----------------------------------------------------------------------------

export const rectSmtPadProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    shape: z.literal("rect"),
    width: distance,
    height: distance,
    portHints: portHints.optional(),
  })
type InferredRectSmtPadProps = z.input<typeof rectSmtPadProps>
expectTypesMatch<InferredRectSmtPadProps, RectSmtPadProps>(true)

export const circleSmtPadProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    shape: z.literal("circle"),
    radius: distance,
    portHints: portHints.optional(),
  })
type InferredCircleSmtPadProps = z.input<typeof circleSmtPadProps>
expectTypesMatch<InferredCircleSmtPadProps, CircleSmtPadProps>(true)

export const smtPadProps = z.union([circleSmtPadProps, rectSmtPadProps])

export type InferredSmtPadProps = z.input<typeof smtPadProps>
expectTypesMatch<InferredSmtPadProps, SmtPadProps>(true)
