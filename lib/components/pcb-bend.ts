import { rotation } from "circuit-json"
import { distance, type Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

/** A bend on a flat flex PCB, with optional tear-relief cutouts. */
export interface PcbBendProps {
  name?: string
  /** Start/end of the bend-zone centerline in the parent PCB coordinate system. */
  x1: Distance
  y1: Distance
  x2: Distance
  y2: Distance
  /** Signed degrees (or an angle string). Positive folds toward the local top face. */
  bendAngle: number | string
  /** Positive neutral-surface radius, in mm or a distance string. */
  bendRadius: Distance
  /**
   * Radius of circular tear-relief cutouts centered at both bend endpoints in
   * the flat PCB. Removes material to round the edge where each cutout meets
   * the board outline. Finite and positive, in mm or a distance string;
   * parsed to mm. Omit to leave the outline unchanged (no tear reliefs).
   * Independent of bendRadius and bendSide; no aliases or conflicting props.
   */
  tearReliefRadius?: Distance
  /** Moving side, looking from (x1, y1) toward (x2, y2) in the flat layout. */
  bendSide: "left" | "right"
}

const finiteDistance = distance.pipe(z.number().finite())

export const pcbBendProps = z
  .object({
    name: z.string().optional(),
    x1: finiteDistance,
    y1: finiteDistance,
    x2: finiteDistance,
    y2: finiteDistance,
    bendAngle: rotation.pipe(z.number().finite()),
    bendRadius: distance.pipe(z.number().finite().positive()),
    tearReliefRadius: distance.pipe(z.number().finite().positive()).optional(),
    bendSide: z.enum(["left", "right"]),
  })
  .refine(({ x1, y1, x2, y2 }) => x1 !== x2 || y1 !== y2, {
    message: "Bend centerline endpoints must be distinct",
    path: ["x2"],
  })

expectTypesMatch<PcbBendProps, z.input<typeof pcbBendProps>>(true)

export type PcbBendPropsInput = z.input<typeof pcbBendProps>
