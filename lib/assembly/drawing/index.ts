import { assemblyDrawingTitleBlockProps } from "./titleblock"
import { assemblyDrawingPageProps } from "./page"
import { assemblyDrawingPartViewProps } from "./partview"

export * from "./page"
export * from "./page-size"
export * from "./titleblock"
export * from "./partview"

/** Drawing namespace; pages contain configured part views. */
export const assemblyDrawingProps = {
  page: assemblyDrawingPageProps,
  titleblock: assemblyDrawingTitleBlockProps,
  partview: assemblyDrawingPartViewProps,
} as const
