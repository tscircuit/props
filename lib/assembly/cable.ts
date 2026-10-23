import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export type AssemblyCableStandard = "usb_c"

export interface AssemblyCableProps {
  /** Stable assembly identity for the cable. */
  name: string
  /** Start connector selector or named assembly reference, e.g. MOTOR.wireside. */
  from: string
  /** End connector selector or named assembly reference. */
  to: string
  /** Optional USB-C-to-USB-C preset. Omit to infer the cable from its endpoints. */
  standard?: AssemblyCableStandard
  /** Explicit cable model specification. Omit to infer the cable from its endpoints. */
  model?: string
  /** Ordered intermediate cable points in the right-handed circuit world frame,
   * in mm: +X right, +Y top, +Z above the board. Each x/y/z must be finite.
   * Omit or pass [] to keep automatic routing. Endpoints remain from/to.
   */
  waypoints?: { x: number; y: number; z: number }[]
}

export const assemblyCableProps = z.object({
  name: z.string().trim().min(1),
  from: z.string().trim().min(1),
  to: z.string().trim().min(1),
  standard: z.literal("usb_c").optional(),
  model: z.string().trim().min(1).optional(),
  waypoints: z
    .array(
      z.object({
        x: z.number().finite(),
        y: z.number().finite(),
        z: z.number().finite(),
      }),
    )
    .optional(),
})

export type AssemblyCablePropsInput = z.input<typeof assemblyCableProps>

expectTypesMatch<AssemblyCableProps, AssemblyCablePropsInput>(true)
