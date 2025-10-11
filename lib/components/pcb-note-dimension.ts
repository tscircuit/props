import { distance, length } from "circuit-json"
import { pcbLayoutProps } from "lib/common/layout"
import { point } from "lib/common/point"
import { z } from "zod"

const dimensionTarget = z.union([z.string(), point])

export const pcbNoteDimensionProps = pcbLayoutProps
  .omit({ pcbX: true, pcbY: true, pcbRotation: true })
  .extend({
    from: dimensionTarget,
    to: dimensionTarget,
    text: z.string().optional(),
    offset: distance.optional(),
    font: z.enum(["tscircuit2024"]).optional(),
    fontSize: length.optional(),
    color: z.string().optional(),
    arrowSize: distance.optional(),
  })
export type PcbNoteDimensionProps = z.input<typeof pcbNoteDimensionProps>
