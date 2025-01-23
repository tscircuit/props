import { distance } from "circuit-json"
import { pcbLayoutProps } from "lib/common/layout"
import { z } from "zod"

export const silkscreenRectProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    isFilled: z.boolean().optional(),
    isOutline: z.boolean().optional(),
    strokeWidth: distance.optional(),
    width: distance,
    height: distance,
  })
export type SilkscreenRectProps = z.input<typeof silkscreenRectProps>
