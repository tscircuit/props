import { assemblyBomProps, type AssemblyBomProps } from "./bom"
import { distance, type Distance } from "lib/common/distance"
import { url } from "lib/common/url"
import {
  manufacturingSurfacePlacementShape,
  refineManufacturingSurfacePlacement,
  type ManufacturingSurfacePlacementProps,
} from "lib/manufacturing/surface-placement"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

/** An adhesive sticker applied to one surface of its parent part. Author it as
 * a child of `assembly.part` or `assembly.printedpart`. It is a separate
 * purchased item with its own BOM line, positioned like a manufacturing mark.
 */
export interface AssemblyStickerProps
  extends ManufacturingSurfacePlacementProps,
    AssemblyBomProps {
  /** Stable identity used by assembly selectors. */
  name: string
  /** Human-facing alternate to the stable name. */
  displayName?: string
  /** URL or static-file import of the printed artwork, an SVG or raster image.
   * It is stretched to the sticker's width and height. Omit for an unprinted
   * sticker.
   */
  imageUrl?: string
  /** Sticker size along the surface's X and Y, in mm or distance strings.
   * With imageUrl, provide at least one; a missing one follows the image's
   * aspect ratio. Without imageUrl, provide both.
   */
  width?: Distance
  height?: Distance
  /** Sticker thickness including its adhesive, in mm or a distance string.
   * Omitted when unspecified; no thickness is assumed.
   */
  thickness?: Distance
  /** Color of the sticker material, seen wherever the artwork is transparent
   * or absent. Omitted when unspecified.
   */
  backgroundColor?: string
}

const extent = distance.pipe(z.number().positive().finite())

export const assemblyStickerProps = z
  .object({
    ...assemblyBomProps.shape,
    ...manufacturingSurfacePlacementShape,
    name: z.string().trim().min(1),
    displayName: z.string().optional(),
    imageUrl: url
      .refine((value) => value.trim().length > 0, "imageUrl cannot be empty")
      .optional(),
    width: extent.optional(),
    height: extent.optional(),
    thickness: extent.optional(),
    backgroundColor: z.string().trim().min(1).optional(),
  })
  .superRefine((sticker, ctx) => {
    refineManufacturingSurfacePlacement(sticker, ctx)
    const missing = (["width", "height"] as const).filter(
      (prop) => sticker[prop] === undefined,
    )
    if (missing.length === 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["width"],
        message: "Provide width, height, or both",
      })
    } else if (missing.length === 1 && sticker.imageUrl === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: [missing[0]!],
        message: "Provide width and height together when there is no imageUrl",
      })
    }
  })

export type AssemblyStickerPropsInput = z.input<typeof assemblyStickerProps>
expectTypesMatch<AssemblyStickerProps, AssemblyStickerPropsInput>(true)
