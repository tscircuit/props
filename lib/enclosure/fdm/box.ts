import { type Distance, distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface EnclosureFdmBoxProps {
  /** Stable enclosure identity. */
  name?: string
  /** The name or selector of the board enclosed by this box. */
  boardRef: string
  /** Optional outside X dimension; inferred from the board when omitted. */
  width?: Distance
  /** Optional outside Y dimension; inferred from the board when omitted. */
  height?: Distance
  /** Optional total outside Z dimension; inferred from the board stack. */
  depth?: Distance
  /** Printed side-wall thickness. */
  wallThickness?: Distance
  /** Base floor thickness. */
  floorThickness?: Distance
  /** Lid top-plate thickness. */
  lidThickness?: Distance
  /** Horizontal clearance between the board edge and inside wall. */
  boardClearance?: Distance
  /** Gap from the inside floor to the PCB bottom. */
  standoffHeight?: Distance
  /**
   * Clearance from the PCB top surface up to the inside of the lid.
   *
   * This is measured from the *board*, not from the tallest component: only
   * parts that declare an aperture report their height, so an arbitrary tall
   * capacitor is invisible here and setting this does not guarantee it clears.
   *
   * Omit it and the depth is inferred instead -- grown until the lid and its lip
   * clear every side-wall aperture, so a connector taller than the default
   * cannot end up straddling the base/lid seam. Setting it explicitly opts out
   * of that: the value is then taken literally, which is what allows a part to
   * deliberately poke through the lid.
   */
  topHeadroom?: Distance
  /** Depth of the friction-fit lid lip. */
  lidLipDepth?: Distance
  /** Disable placement of apertures explicitly declared by enclosed components. */
  disableCutouts?: boolean
  /** Show edges hidden behind the enclosure surface in compatible 3D viewers. */
  showHiddenEdges?: boolean
}

export const enclosureFdmBoxProps = z.object({
  name: z.string().optional(),
  boardRef: z.string().min(1),
  width: distance.optional(),
  height: distance.optional(),
  depth: distance.optional(),
  wallThickness: distance.default("2mm"),
  floorThickness: distance.optional(),
  lidThickness: distance.optional(),
  boardClearance: distance.optional(),
  standoffHeight: distance.optional(),
  topHeadroom: distance.optional(),
  lidLipDepth: distance.optional(),
  disableCutouts: z.boolean().optional(),
  showHiddenEdges: z.boolean().optional(),
})

export type EnclosureFdmBoxPropsInput = z.input<typeof enclosureFdmBoxProps>

expectTypesMatch<EnclosureFdmBoxProps, EnclosureFdmBoxPropsInput>(true)
