import { distance } from "lib/common/distance"
import { pcbLayoutProps } from "lib/common/layout"
import { z } from "zod"

const positiveDistance = distance.pipe(z.number().finite().positive())
const finiteDistance = distance.pipe(z.number().finite())
const stiffenerBaseProps = pcbLayoutProps.omit({ layer: true }).extend({
  name: z.string().optional(),
  /** Board attachment face, not a copper-layer assignment. Required. */
  layer: z.enum(["top", "bottom"]),
  material: z.enum(["fr4", "polyimide", "stainless_steel", "aluminum"]),
  /** Stiffener material thickness only, excluding PCB and adhesive. */
  thickness: positiveDistance,
  /** Nonnegative adhesive thickness; omission means unspecified, not zero. */
  adhesiveThickness: distance
    .pipe(z.number().finite().nonnegative())
    .optional(),
})

export const pcbStiffenerProps = z.discriminatedUnion("shape", [
  stiffenerBaseProps.extend({
    shape: z.literal("rect"),
    width: positiveDistance,
    height: positiveDistance,
    outline: z.never().optional(),
  }),
  stiffenerBaseProps.extend({
    shape: z.literal("polygon"),
    /** Local vertices transformed by pcbX/pcbY/pcbRotation; implicitly closed. */
    outline: z
      .array(z.object({ x: finiteDistance, y: finiteDistance }))
      .min(3)
      .refine((points) => {
        const twiceArea = points.reduce((sum, p, i) => {
          const next = points[(i + 1) % points.length]!
          return sum + p.x * next.y - next.x * p.y
        }, 0)
        return Number.isFinite(twiceArea) && twiceArea !== 0
      }, "Stiffener outline must enclose a nonzero area"),
    width: z.never().optional(),
    height: z.never().optional(),
  }),
])

/** Bonded mechanical reinforcement; does not add copper layers or a rigid stackup. */
export type PcbStiffenerProps = z.input<typeof pcbStiffenerProps>

export type PcbStiffenerPropsInput = z.input<typeof pcbStiffenerProps>
