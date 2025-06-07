import { pcbLayoutProps, type PcbLayoutProps } from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface BreakoutPointProps
  extends Omit<PcbLayoutProps, "pcbRotation" | "layer"> {
  connection: string
}

export const breakoutPointProps = pcbLayoutProps
  .omit({ pcbRotation: true, layer: true })
  .extend({
    connection: z.string(),
  })

type InferredBreakoutPointProps = z.input<typeof breakoutPointProps>
expectTypesMatch<BreakoutPointProps, InferredBreakoutPointProps>(true)
