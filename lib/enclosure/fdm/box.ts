import { type Distance, distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface EnclosureFdmBoxProps {
  /** The name or selector of the board enclosed by this box. */
  boardRef: string
  width?: Distance
  height?: Distance
  depth?: Distance
  wallThickness?: Distance
}

export const enclosureFdmBoxProps = z.object({
  boardRef: z.string().min(1),
  width: distance.optional(),
  height: distance.optional(),
  depth: distance.optional(),
  wallThickness: distance.default("2mm"),
})

export type EnclosureFdmBoxPropsInput = z.input<typeof enclosureFdmBoxProps>

expectTypesMatch<EnclosureFdmBoxProps, EnclosureFdmBoxPropsInput>(true)
