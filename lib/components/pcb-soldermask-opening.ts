import { distance } from "lib/common/distance"
import { pcbLayoutProps } from "lib/common/layout"
import { z } from "zod"

const finiteDistance = distance.pipe(z.number().finite())
const positiveDistance = distance.pipe(z.number().finite().positive())
const openingBaseProps = pcbLayoutProps.omit({ layer: true }).extend({
  name: z.string().optional(),
  /** Face whose solder mask or flex coverlay is removed. Required. */
  layer: z.enum(["top", "bottom"]),
})

export const pcbSoldermaskOpeningProps = z.discriminatedUnion("shape", [
  openingBaseProps.extend({
    shape: z.literal("rect"),
    width: positiveDistance,
    height: positiveDistance,
    radius: z.never().optional(),
    points: z.never().optional(),
  }),
  openingBaseProps.extend({
    shape: z.literal("circle"),
    radius: positiveDistance,
    width: z.never().optional(),
    height: z.never().optional(),
    points: z.never().optional(),
  }),
  openingBaseProps.extend({
    shape: z.literal("polygon"),
    /** Local vertices; pcbX/pcbY/pcbRotation place the implicitly closed boundary. */
    points: z
      .array(z.object({ x: finiteDistance, y: finiteDistance }))
      .min(3)
      .refine((points) => {
        const twiceArea = points.reduce((sum, point, index) => {
          const next = points[(index + 1) % points.length]!
          return sum + point.x * next.y - next.x * point.y
        }, 0)
        return Number.isFinite(twiceArea) && twiceArea !== 0
      }, "Solder-mask opening must enclose a nonzero area"),
    width: z.never().optional(),
    height: z.never().optional(),
    radius: z.never().optional(),
  }),
])

/**
 * A solder-mask or flex-coverlay aperture independent of pads and holes.
 * Exposes underlying copper or substrate without adding copper, paste, or connectivity.
 * Geometry is local to its parent, in mm (+X right, +Y top); use pcbRotation for rectangles.
 */
export type PcbSoldermaskOpeningProps = z.input<
  typeof pcbSoldermaskOpeningProps
>

export type PcbSoldermaskOpeningPropsInput = PcbSoldermaskOpeningProps
