import { supplierProps, type SupplierProps } from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

/** Purchasing metadata shared by physical assembly elements, not CAD primitives. */
export interface AssemblyBomProps extends SupplierProps {
  /** Alternative HTTP(S) purchase links, independent of supplier part numbers.
   * Omitted and empty arrays are accepted. No SKU-to-URL mapping is inferred.
   */
  purchaseUrls?: string[]
}

export const assemblyBomProps = supplierProps.extend({
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
