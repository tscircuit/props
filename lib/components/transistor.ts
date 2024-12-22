import { voltage, current } from "circuit-json"
import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface TransistorProps extends CommonComponentProps {
  transistorType: "NPN" | "PNP"
  pinLabels: Record<"emitter" | "base" | "collector", string>
  vce?: number | string
  vbe?: number | string
  ic?: number | string
}

export const transistorProps = commonComponentProps.extend({
  transistorType: z.enum(["NPN", "PNP"]),
  pinLabels: z.object({
    emitter: z.string(),
    base: z.string(),
    collector: z.string(),
  }),
  vce: voltage.optional(),
  vbe: voltage.optional(),
  ic: current.optional(),
})

type InferredTransistorProps = z.input<typeof transistorProps>
expectTypesMatch<TransistorProps, InferredTransistorProps>(true)
