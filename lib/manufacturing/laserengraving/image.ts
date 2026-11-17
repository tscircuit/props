import { distance, type Distance } from "lib/common/distance"
import { url } from "lib/common/url"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { refineManufacturingSurfacePlacement } from "../surface-placement"
import {
  manufacturingLaserEngravingShape,
  type ManufacturingLaserEngravingProps,
} from "./common"

/** An image laser engraved onto a surface of the parent part. */
export interface ManufacturingLaserEngravingImageProps
  extends ManufacturingLaserEngravingProps {
  /** URL or static-file import of an SVG or raster image. */
  imageUrl: string
  /** Engraved size along the surface's X and Y, in mm or distance strings.
   * Provide at least one; a missing one follows the image's aspect ratio.
   */
  width?: Distance
  height?: Distance
  /** How a raster image becomes laser output: `threshold` cuts each pixel on
   * or off, `dither` approximates tones with dots, `grayscale` varies power.
   * Omitted when unspecified; it does not apply to vector images.
   */
  rasterMode?: "threshold" | "dither" | "grayscale"
  /** Engrave the light areas of the image instead of the dark ones. */
  invertImage?: boolean
}

const extent = distance.pipe(z.number().positive().finite())

export const manufacturingLaserEngravingImageProps = z
  .object({
    ...manufacturingLaserEngravingShape,
    imageUrl: url.refine(
      (value) => value.trim().length > 0,
      "imageUrl cannot be empty",
    ),
    width: extent.optional(),
    height: extent.optional(),
    rasterMode: z.enum(["threshold", "dither", "grayscale"]).optional(),
    invertImage: z.boolean().optional(),
  })
  .superRefine((image, ctx) => {
    refineManufacturingSurfacePlacement(image, ctx)
    if (image.width === undefined && image.height === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["width"],
        message: "Provide width, height, or both",
      })
    }
  })

export type ManufacturingLaserEngravingImagePropsInput = z.input<
  typeof manufacturingLaserEngravingImageProps
>
expectTypesMatch<
  ManufacturingLaserEngravingImageProps,
  ManufacturingLaserEngravingImagePropsInput
>(true)
