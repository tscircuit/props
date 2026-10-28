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
  waypoints?: { x: number; y: number; z: number }[]
  /** Reference endpoint for waypoint offsets. Required when waypoints is defined. */
  waypointAnchor?: "start" | "end"
  /** Board orientation for waypoint axes. Required when waypoints is defined. */
  waypointAxisOrientation?: "board_at_start" | "board_at_end"
}

export const assemblyCableProps = z
  .object({
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
    waypointAnchor: z.enum(["start", "end"]).optional(),
    waypointAxisOrientation: z
      .enum(["board_at_start", "board_at_end"])
      .optional(),
  })
  .superRefine((cable, context) => {
    if (cable.waypoints === undefined) return

    if (cable.waypointAnchor === undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["waypointAnchor"],
        message: "waypointAnchor is required when waypoints is defined",
      })
    }
    if (cable.waypointAxisOrientation === undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["waypointAxisOrientation"],
        message:
          "waypointAxisOrientation is required when waypoints is defined",
      })
    }
  })

export type AssemblyCablePropsInput = z.input<typeof assemblyCableProps>

expectTypesMatch<AssemblyCableProps, AssemblyCablePropsInput>(true)
