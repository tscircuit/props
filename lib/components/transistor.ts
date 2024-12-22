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
  collectorEmitterVoltage?: number | string
  baseEmitterVoltage?: number | string
  collectorCurrent?: number | string
}

export const transistorProps = commonComponentProps.extend({
  transistorType: z.enum(["NPN", "PNP"]),
  pinLabels: z.object({
    emitter: z.string(),
    base: z.string(),
    collector: z.string(),
  }),
  collectorEmitterVoltage: voltage.optional(),
  baseEmitterVoltage: voltage.optional(),
  collectorCurrent: current.optional(),
})

type InferredTransistorProps = z.input<typeof transistorProps>
expectTypesMatch<TransistorProps, InferredTransistorProps>(true)
