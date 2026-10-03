import { z } from "zod"
import { distance, resistance } from "circuit-json"
import { expectTypesMatch } from "lib/typecheck"

/** Check constraints on a bus or pair, without protocol/vendor defaults.
 * Numeric distances are mm; impedance values are ohms. All fields are optional.
 * referenceBus/otherBus use bus names in the same subcircuit. */
export interface PcbRoutingConstraints {
  expectedTraceCount?: number
  /** Without a reference, min/max are absolute lengths. With a reference,
   * they are offsets from its longest pad-to-pad Manhattan distance.
   * Both reference fields must be supplied together. */
  lengthBounds?: {
    referenceBus?: string
    referenceMetric?: "longest_manhattan"
    min?: number | string
    max?: number | string
  }
  /** Centreline spacing uses the larger local trace width. Each rule applies
   * to members of otherBus; self comparisons are skipped. Reduced spacing
   * needs a multiplier and maxReducedSpacingLength (union of intervals). */
  spacing?: Array<{
    otherBus: string
    centerlineWidthMultiplier: number
    reducedCenterlineWidthMultiplier?: number
  }>
  /** Maximum total reduced-spacing length per signal across all spacing rules. */
  maxReducedSpacingLength?: number | string
  /** Acceptable declared target (single-ended for buses, differential for pairs).
   * Actual impedance still needs stackup analysis. */
  impedanceBounds?: { min?: number | string; max?: number | string }
}
const finiteDistance = distance.pipe(z.number().finite())
const impedance = resistance.pipe(z.number().nonnegative().finite())
export const pcbRoutingConstraints = z
  .object({
    expectedTraceCount: z.number().int().positive().optional(),
    lengthBounds: z
      .object({
        referenceBus: z.string().min(1).optional(),
        referenceMetric: z.literal("longest_manhattan").optional(),
        min: finiteDistance.optional(),
        max: finiteDistance.optional(),
      })
      .refine(
        (b) =>
          Boolean(b.referenceBus) === Boolean(b.referenceMetric) &&
          (b.min !== undefined || b.max !== undefined) &&
          !(b.min !== undefined && b.max !== undefined && b.min > b.max) &&
          (b.referenceBus !== undefined ||
            ((b.min ?? 0) >= 0 && (b.max ?? 0) >= 0)),
        "Provide ordered bounds and both reference fields for relative lengths",
      )
      .optional(),
    spacing: z
      .array(
        z
          .object({
            otherBus: z.string().min(1),
            centerlineWidthMultiplier: z.number().positive().finite(),
            reducedCenterlineWidthMultiplier: z
              .number()
              .positive()
              .finite()
              .optional(),
          })
          .refine(
            (s) =>
              (s.reducedCenterlineWidthMultiplier ??
                s.centerlineWidthMultiplier) <= s.centerlineWidthMultiplier,
            "Reduced spacing cannot exceed normal spacing",
          ),
      )
      .min(1)
      .optional(),
    maxReducedSpacingLength: finiteDistance
      .pipe(z.number().nonnegative())
      .optional(),
    impedanceBounds: z
      .object({ min: impedance.optional(), max: impedance.optional() })
      .refine(
        (b) =>
          (b.min !== undefined || b.max !== undefined) &&
          !(b.min !== undefined && b.max !== undefined && b.min > b.max),
        "Provide ordered min/max bounds",
      )
      .optional(),
  })
  .refine(
    (c) =>
      Boolean(
        c.spacing?.some(
          (s) => s.reducedCenterlineWidthMultiplier !== undefined,
        ),
      ) ===
      (c.maxReducedSpacingLength !== undefined),
    "Reduced spacing requires a shared length cap, and the cap requires reduced spacing",
  )
expectTypesMatch<PcbRoutingConstraints, z.input<typeof pcbRoutingConstraints>>(
  true,
)
