import { distance, layer_ref, point } from "circuit-json"
import { pcbLayoutProps } from "lib/common/layout"
import { z } from "zod"

export const pcbKeepoutProps = z.union([
  pcbLayoutProps.omit({ pcbRotation: true }).extend({
    shape: z.literal("circle"),
    radius: distance,
    layers: z.array(layer_ref).optional(),
    /** Report keepout violations as warnings when true. Omit for normal enforcement. */
    warningOnly: z.boolean().optional(),
    /** Allow trace crossings without keepout diagnostics. False or omitted retains enforcement; copper pours remain excluded. */
    allowTraces: z.boolean().optional(),
    /** Allow components and their pads/plated holes without keepout diagnostics. False or omitted retains enforcement; copper pours remain excluded. */
    allowPlacements: z.boolean().optional(),
    description: z.string().optional(),
    excludeRefs: z
      .array(z.string())
      .optional()
      .describe(
        'Component selectors excluded from the keepout, such as ".ANT1"',
      ),
  }),
  pcbLayoutProps.extend({
    shape: z.literal("rect"),
    width: distance,
    height: distance,
    layers: z.array(layer_ref).optional(),
    /** Report keepout violations as warnings when true. Omit for normal enforcement. */
    warningOnly: z.boolean().optional(),
    /** Allow trace crossings without keepout diagnostics. False or omitted retains enforcement; copper pours remain excluded. */
    allowTraces: z.boolean().optional(),
    /** Allow components and their pads/plated holes without keepout diagnostics. False or omitted retains enforcement; copper pours remain excluded. */
    allowPlacements: z.boolean().optional(),
    description: z.string().optional(),
    excludeRefs: z
      .array(z.string())
      .optional()
      .describe(
        'Component selectors excluded from the keepout, such as ".ANT1"',
      ),
  }),
  pcbLayoutProps.extend({
    shape: z.literal("outline"),
    outline: z.array(point).min(2),
    strokeWidth: distance,
    layers: z.array(layer_ref).optional(),
    /** Report keepout violations as warnings when true. Omit for normal enforcement. */
    warningOnly: z.boolean().optional(),
    /** Allow trace crossings without keepout diagnostics. False or omitted retains enforcement; copper pours remain excluded. */
    allowTraces: z.boolean().optional(),
    /** Allow components and their pads/plated holes without keepout diagnostics. False or omitted retains enforcement; copper pours remain excluded. */
    allowPlacements: z.boolean().optional(),
    description: z.string().optional(),
    excludeRefs: z
      .array(z.string())
      .optional()
      .describe(
        'Component selectors excluded from the keepout, such as ".ANT1"',
      ),
  }),
])
export type PcbKeepoutProps = z.input<typeof pcbKeepoutProps>
