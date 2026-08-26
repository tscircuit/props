import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"

/** Props for embedding a raw SVG graphic in a schematic sheet. */
export interface SchematicGraphicProps {
  /** Complete SVG markup, including its dimensions or viewBox. */
  svgContent: string
}

export const schematicGraphicProps = z.object({
  svgContent: z.string(),
})

export type InferredSchematicGraphicProps = z.input<
  typeof schematicGraphicProps
>

expectTypesMatch<SchematicGraphicProps, z.input<typeof schematicGraphicProps>>(
  true,
)
