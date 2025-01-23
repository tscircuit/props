import { distance } from "circuit-json"
import { pcbLayoutProps } from "lib/common/layout"
import { z } from "zod"

export const pcbKeepoutProps = z.union([
  pcbLayoutProps.omit({ pcbRotation: true }).extend({
    shape: z.literal("circle"),
    radius: distance,
  }),
  pcbLayoutProps.extend({
    shape: z.literal("rect"),
    width: distance,
    height: distance,
  }),
])
export type PcbKeepoutProps = z.input<typeof pcbKeepoutProps>
