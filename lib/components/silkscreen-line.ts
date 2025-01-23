import { distance } from "circuit-json"
import { pcbLayoutProps } from "lib/common/layout"
import type { z } from "zod"

export const silkscreenLineProps = pcbLayoutProps
  .omit({ pcbX: true, pcbY: true, pcbRotation: true })
  .extend({
    strokeWidth: distance,
    x1: distance,
    y1: distance,
    x2: distance,
    y2: distance,
  })
export type SilkscreenLineProps = z.input<typeof silkscreenLineProps>
