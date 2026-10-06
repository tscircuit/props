import { z } from "zod"
import { bulletDiameter } from "../components/connector"
import { point3 } from "../common/point3"
import {
  type CadModelAxisDirection,
  cadModelAxisDirection,
} from "../common/cadModel"
import { type Distance } from "../common/distance"
import { expectTypesMatch } from "lib/typecheck"

/** A physical cable interface on imported CAD, independent of PCB footprints. */
export interface AssemblyCableConnectorProps {
  standard: "bullet"
  bulletDiameter: Distance
  /** Gender on the CAD assembly; the cable uses the opposite gender. */
  bulletGender: "male" | "female"
  /** Number of independent circuits; defaults to one, 1–16. */
  pinCount?: number
  /** Mating center relative to the CAD placement anchor, in physical mm,
   * right-handed model-local +X/+Y/+Z, before its rotation and positionOffset.
   * Do not use mesh file units; this is already a physical offset in mm.
   */
  position: { x: Distance; y: Distance; z: Distance }
  /** Outward mating axis in that same model-local frame. Required. */
  facingDirection: CadModelAxisDirection
}

export const assemblyCableConnectorProps = z
  .object({
    standard: z.literal("bullet"),
    bulletDiameter,
    bulletGender: z.enum(["male", "female"]),
    pinCount: z.number().int().min(1).max(16).optional(),
    position: point3,
    facingDirection: cadModelAxisDirection,
  })
  .strict()

export type ParsedAssemblyCableConnectorProps = z.output<
  typeof assemblyCableConnectorProps
>
expectTypesMatch<
  AssemblyCableConnectorProps,
  z.input<typeof assemblyCableConnectorProps>
>(true)
