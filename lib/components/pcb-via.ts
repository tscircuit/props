import { layer_ref } from "circuit-json"
import { z } from "zod"
import { viaProps } from "./via"

/**
 * Low-level props for inserting an already-computed PCB via.
 * Prefer `ViaProps` when the via should participate in connectivity solving.
 */
export const pcbViaProps = viaProps
  .extend({
    layers: z.array(layer_ref).optional(),
    /** @deprecated Use `tentedOnTop` and `tentedOnBottom` instead. */
    isTented: z.boolean().optional(),
    tentedOnTop: z.boolean().optional(),
    tentedOnBottom: z.boolean().optional(),
  })
  .partial({
    fromLayer: true,
    toLayer: true,
  })

export type PcbViaProps = z.input<typeof pcbViaProps>
