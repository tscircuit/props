import { z } from "zod"
import { type Distance, distance } from "lib/common/distance"
import { url } from "lib/common/url"
import { expectTypesMatch } from "lib/typecheck"

/**
 * Props for embedding an image or raw SVG graphic in a schematic sheet.
 * At least one source is required; both sources may be provided.
 * When both are provided, imageUrl is the canonical asset source and
 * svgContent is optional materialized fallback content.
 */
export interface SchematicGraphicProps {
  /** URL or static-file import for the canonical source SVG asset. */
  imageUrl?: string
  /**
   * Complete SVG markup, including its dimensions or viewBox. Used as the
   * source when imageUrl is omitted, or as fallback content when both exist.
   */
  svgContent?: string
  /** Optional rendered width of the graphic. */
  width?: Distance
  /** Optional rendered height of the graphic. */
  height?: Distance
}

const nonemptyUrl = url.refine((value) => value.trim().length > 0, {
  message: "imageUrl cannot be empty",
})

const positiveDistance = (fieldName: "width" | "height") =>
  distance.refine((value) => Number.isFinite(value) && value > 0, {
    message: `${fieldName} must be a positive finite distance`,
  })

export const schematicGraphicProps = z
  .object({
    imageUrl: nonemptyUrl.optional(),
    svgContent: z
      .string()
      .refine((value) => value.trim().length > 0, {
        message: "svgContent cannot be empty",
      })
      .optional(),
    width: positiveDistance("width").optional(),
    height: positiveDistance("height").optional(),
  })
  .superRefine(({ imageUrl, svgContent }, ctx) => {
    if (imageUrl === undefined && svgContent === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one of imageUrl or svgContent is required",
      })
    }
  })

export type InferredSchematicGraphicProps = z.input<
  typeof schematicGraphicProps
>

expectTypesMatch<SchematicGraphicProps, z.input<typeof schematicGraphicProps>>(
  true,
)
