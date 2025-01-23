import { distance } from "circuit-json"
import { pcbLayoutProps } from "lib/common/layout"
import { z } from "zod"

export const silkscreenCircleProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    isFilled: z.boolean().optional(),
    isOutline: z.boolean().optional(),
    strokeWidth: distance.optional(),
    radius: distance,
  })
export type SilkscreenCircleProps = z.input<typeof silkscreenCircleProps>
