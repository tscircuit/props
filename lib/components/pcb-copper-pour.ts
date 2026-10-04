import { brep_shape, distance, layer_ref, point } from "circuit-json"
import { pcbLayoutProps } from "lib/common/layout"
import { z } from "zod"

const positiveDistance = distance.pipe(z.number().finite().positive())
const polygonPoints = z
  .array(point)
  .min(3)
  .refine((points) => {
    const twiceArea = points.reduce((area, point, pointIndex) => {
      const nextPoint = points[(pointIndex + 1) % points.length]!
      return area + point.x * nextPoint.y - nextPoint.x * point.y
    }, 0)
    return Number.isFinite(twiceArea) && twiceArea !== 0
  }, "Copper-pour polygon must enclose a nonzero area")
const pcbCopperPourBaseProps = pcbLayoutProps.omit({ layer: true }).extend({
  name: z.string().optional(),
  connectsTo: z.string().optional(),
  coveredWithSolderMask: z.boolean().optional().default(true),
  layer: layer_ref,
})

/**
 * Advanced escape hatch for inserting one already-computed PCB copper region.
 * Use one `<pcbcopperpour />` per disconnected region; B-rep inner rings are
 * voids within that region.
 *
 * Prefer `CopperPourProps` when the pour should be solved from an outline and
 * electrical net inside tscircuit.
 */
export const pcbCopperPourProps = z.discriminatedUnion("shape", [
  pcbCopperPourBaseProps.extend({
    shape: z.literal("rect"),
    width: positiveDistance,
    height: positiveDistance,
    points: z.never().optional(),
    brepShape: z.never().optional(),
  }),
  pcbCopperPourBaseProps.extend({
    shape: z.literal("polygon"),
    points: polygonPoints,
    width: z.never().optional(),
    height: z.never().optional(),
    brepShape: z.never().optional(),
  }),
  pcbCopperPourBaseProps.extend({
    shape: z.literal("brep"),
    brepShape: brep_shape,
    width: z.never().optional(),
    height: z.never().optional(),
    points: z.never().optional(),
  }),
])

export type PcbCopperPourProps = z.input<typeof pcbCopperPourProps>
