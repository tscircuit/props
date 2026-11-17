import { distance, type Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { refineManufacturingSurfacePlacement } from "../surface-placement"
import {
  manufacturingLaserEngravingShape,
  type ManufacturingLaserEngravingProps,
} from "./common"

/** Text laser engraved onto a surface of the parent part. It reads left to
 * right along the surface's in-plane X direction, seen from outside the part.
 */
export interface ManufacturingLaserEngravingTextProps
  extends ManufacturingLaserEngravingProps {
  text: string
  /** Text height, in mm or a distance string. Required; no size is assumed. */
  fontSize: Distance
  font?: "tscircuit2024"
  /** `filled` engraves the letter bodies; `outline` traces their edges.
   * Omitted when unspecified.
   */
  textStyle?: "filled" | "outline"
}

export const manufacturingLaserEngravingTextProps = z
  .object({
    ...manufacturingLaserEngravingShape,
    text: z
      .string()
      .refine((value) => value.trim().length > 0, "Text must not be blank"),
    fontSize: distance.pipe(z.number().positive().finite()),
    font: z.enum(["tscircuit2024"]).optional(),
    textStyle: z.enum(["filled", "outline"]).optional(),
  })
  .superRefine(refineManufacturingSurfacePlacement)

export type ManufacturingLaserEngravingTextPropsInput = z.input<
  typeof manufacturingLaserEngravingTextProps
>
expectTypesMatch<
  ManufacturingLaserEngravingTextProps,
  ManufacturingLaserEngravingTextPropsInput
>(true)
