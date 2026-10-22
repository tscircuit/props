import { assemblyDrawingTitleBlockProps } from "./titleblock"
import { assemblyDrawingPageProps } from "./page"
import { assemblyDrawingPartViewProps } from "./partview"
import { assemblyDrawingDimensionProps } from "./dimension"

export * from "./page"
export * from "./page-size"
export * from "./titleblock"
export * from "./partview"
export * from "./dimension"

/** Drawing namespace; pages contain configured part views. */
export const assemblyDrawingProps = {
  page: assemblyDrawingPageProps,
  titleblock: assemblyDrawingTitleBlockProps,
  partview: assemblyDrawingPartViewProps,
  dimension: assemblyDrawingDimensionProps,
} as const
