import { z } from "zod"
import { point3 } from "../common/point3"
import {
  type CadModelAxisDirection,
  cadModelAxisDirection,
} from "../common/cadModel"
import { type Distance } from "../common/distance"
import { expectTypesMatch } from "lib/typecheck"

/** A physical cable interface on imported CAD, independent of PCB footprints. */
export interface AssemblyCableConnectorProps {
  /** Modelprinter specification for the physical mating interface. */
  model: string
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
    model: z.string().trim().min(1),
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
