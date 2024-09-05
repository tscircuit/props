import { z } from "zod"
import { distance, type Distance } from "lib/common/distance"
import { pcbLayoutProps, type PcbLayoutProps } from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"

export interface HoleProps extends Omit<PcbLayoutProps, "pcbRotation"> {
  name?: string
  diameter?: Distance
  radius?: Distance
}

export const holeProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    name: z.string().optional(),
    diameter: distance.optional(),
    radius: distance.optional(),
  })
  .transform((d) => ({
    ...d,
    diameter: d.diameter ?? 2 * d.radius!,
    radius: d.radius ?? d.diameter! / 2,
  }))

export type InferredHoleProps = z.input<typeof holeProps>

expectTypesMatch<HoleProps, InferredHoleProps>(true)
