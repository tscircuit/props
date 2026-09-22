import { rotation } from "circuit-json"
import { distance, type Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

/** A bend on a flat flex PCB. Does not change fabrication coordinates. */
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
    bendSide: z.enum(["left", "right"]),
  })
  .refine(({ x1, y1, x2, y2 }) => x1 !== x2 || y1 !== y2, {
    message: "Bend centerline endpoints must be distinct",
    path: ["x2"],
  })

expectTypesMatch<PcbBendProps, z.input<typeof pcbBendProps>>(true)

export type PcbBendPropsInput = z.input<typeof pcbBendProps>
