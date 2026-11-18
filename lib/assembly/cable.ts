import { assemblyBomProps, type AssemblyBomProps } from "./bom"
import { distance } from "circuit-json"
import type { Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { wireAwg } from "./cablewire"

export type AssemblyCableStandard = "usb_c"

export interface AssemblyCableProps extends AssemblyBomProps {
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
  /** Manufactured length between the two connector wire exits, e.g. "50mm". A build specification; routing and slack do not change it. */
  length?: Distance
  /** Symmetric plus/minus tolerance on length. Requires length. */
  lengthTolerance?: Distance
  /** Designator of the cable's own connector at the from end on harness drawings and wiring tables, e.g. "H1". */
  fromConnectorName?: string
  /** Designator of the cable's own connector at the to end. */
  toConnectorName?: string
  /** Conductor gauge inherited by assembly.cablewire children: 22 or "22awg". */
  wireAwg?: number | string
  /** assembly.cablewire children stating the pin-to-pin wiring. Omit to leave wiring unstated. */
  children?: any
}

export const assemblyCableProps = z
  .object({
    ...assemblyBomProps.shape,
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
    length: distance.pipe(z.number().finite().positive()).optional(),
    lengthTolerance: distance
      .pipe(z.number().finite().nonnegative())
      .optional(),
    fromConnectorName: z.string().trim().min(1).optional(),
    toConnectorName: z.string().trim().min(1).optional(),
    wireAwg: wireAwg.optional(),
    children: z.any().optional(),
  })
  .superRefine((cable, context) => {
    if (cable.lengthTolerance !== undefined && cable.length === undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["lengthTolerance"],
        message: "lengthTolerance requires length",
      })
    }
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
