import { layer_ref, type LayerRefInput } from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

/** A physical terminal voltage/current pair. Positive voltage is signal minus reference.
 * Selectors resolve existing PCB ports after routing; they do not create copper.
 * The same physical reference contact may be shared by multiple noise ports.
 */
export interface PcbNoisePortProps {
  name: string
  signal: string
  reference: string
  /** Required by core when the signal contact spans multiple copper layers. */
  signalLayer?: LayerRefInput
  /** Required by core when the reference contact spans multiple copper layers. */
  referenceLayer?: LayerRefInput
}

export const pcbNoisePortProps = z
  .object({
    name: z.string().trim().min(1),
    signal: z.string().trim().min(1),
    reference: z.string().trim().min(1),
    signalLayer: layer_ref.optional(),
    referenceLayer: layer_ref.optional(),
  })
  .strict()

expectTypesMatch<PcbNoisePortProps, z.input<typeof pcbNoisePortProps>>(true)
