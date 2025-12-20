import { distance } from "circuit-json"
import type { PcbLayoutProps } from "lib/common/layout"
import { pcbLayoutProps } from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import type { Distance } from "lib/common/distance"

export interface SilkscreenPillProps
  extends Omit<PcbLayoutProps, "pcbRotation"> {
  width: Distance
  height: Distance
}

export const silkscreenPillProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    width: distance,
    height: distance,
  })

type InferredSilkscreenPillProps = z.input<typeof silkscreenPillProps>

expectTypesMatch<SilkscreenPillProps, InferredSilkscreenPillProps>(true)
