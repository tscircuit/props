import { z } from "zod"
import { distance, point } from "@tscircuit/soup"

export const boardProps = z.object({
  width: distance,
  height: distance,
  outline: z.array(point).optional(),
  pcbX: distance.optional().default(0),
  pcbY: distance.optional().default(0),
  layout: z.any().optional(),
  routingDisabled: z.boolean().optional(),
  children: z.any(),
})
export type BoardProps = z.input<typeof boardProps>
import { z } from "zod"
import { pcbLayoutProps } from "../types/common"
import { distance } from "@tscircuit/soup"
import { portHints } from "../utils/portHints"

export const smtPadProps = z.union([
  pcbLayoutProps.omit({ pcbRotation: true }).extend({
    shape: z.literal("circle"),
    radius: distance.optional(),
    portHints: portHints.optional(),
  }),
  pcbLayoutProps.omit({ pcbRotation: true }).extend({
    shape: z.literal("rect"),
    width: distance.optional(),
    height: distance.optional(),
    portHints: portHints.optional(),
  }),
])
export type SmtPadProps = z.input<typeof smtPadProps>
import { z } from "zod"
import { commonLayoutProps } from "../types/common"

export const footprintProps = z.object({})
export type FootprintProps = z.input<typeof footprintProps>

export const componentProps = commonLayoutProps
export type ComponentProps = z.input<typeof componentProps>
import { z } from "zod"
import { commonLayoutProps } from "../types/common"
import { direction } from "../utils/direction"

export const portProps = commonLayoutProps.extend({
  name: z.string(),
  pinNumber: z.number().optional(),
  aliases: z.array(z.string()).optional(),
  direction: direction,
})
export type PortProps = z.input<typeof portProps>
