import { supplierProps, type SupplierProps } from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

/** Purchasing metadata shared by physical assembly elements, not CAD primitives. */
export interface AssemblyBomProps extends SupplierProps {
  /** Positive safe integer count per parent assembly; defaults to 1 in core.
   * Does not duplicate CAD geometry. Omitted values stay omitted on parse.
   */
  bomQuantity?: number
  /** Alternative HTTP(S) purchase links, independent of supplier part numbers.
   * Omitted and empty arrays are accepted. No SKU-to-URL mapping is inferred.
   */
  purchaseUrls?: string[]
}

export const assemblyBomProps = supplierProps.extend({
  bomQuantity: z.number().int().positive().safe().optional(),
  purchaseUrls: z
    .array(
      z
        .string()
        .url()
        .refine((value) => /^https?:\/\//i.test(value), {
          message: "Purchase links must use HTTP or HTTPS",
        }),
    )
    .optional(),
})

expectTypesMatch<AssemblyBomProps, z.input<typeof assemblyBomProps>>(true)
