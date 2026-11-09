import { ibisModelDefinition, type IbisModelDefinition } from "lib/common/ibis"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

/** Declares a model for an existing chip. Rendering never fetches or converts the source. */
export interface SignalIntegrityIbisModelProps extends IbisModelDefinition {
  /** Selector for exactly one source component in this subcircuit. */
  componentRef: string
}
export const signalIntegrityIbisModelProps = ibisModelDefinition
  .extend({ componentRef: z.string().min(1) })
  .strict()
expectTypesMatch<
  SignalIntegrityIbisModelProps,
  z.input<typeof signalIntegrityIbisModelProps>
>(true)
