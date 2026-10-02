import { brep_shape, distance, layer_ref, point, rotation } from "circuit-json"
import { z } from "zod"

const pcbCopperPourCommonProps = {
  connectsTo: z.string().optional(),
  coveredWithSolderMask: z.boolean().optional().default(true),
  layer: layer_ref,
  sourceNetId: z.string().optional(),
}

/**
 * Advanced escape hatch for inserting already-computed PCB copper geometry.
 * Prefer `CopperPourProps` when the pour should be solved from an outline and
 * electrical net inside tscircuit.
 */
export const pcbCopperPourProps = z.discriminatedUnion("shape", [
  z.object({
    ...pcbCopperPourCommonProps,
    shape: z.literal("rect"),
    pcbX: distance,
    pcbY: distance,
    width: distance,
    height: distance,
    pcbRotation: rotation.optional(),
  }),
  z.object({
    ...pcbCopperPourCommonProps,
    shape: z.literal("polygon"),
    points: z.array(point),
  }),
  z.object({
    ...pcbCopperPourCommonProps,
    shape: z.literal("brep"),
    brepShape: brep_shape,
  }),
])

export type PcbCopperPourProps = z.input<typeof pcbCopperPourProps>
