import { distance } from "circuit-json"
import { pcbLayoutProps } from "lib/common/layout"
import { z } from "zod"
export const courtyardCircleProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    radius: distance,
  })
export type CourtyardCircleProps = z.input<typeof courtyardCircleProps>
