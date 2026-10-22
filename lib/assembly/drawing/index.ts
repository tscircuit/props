import { assemblyDrawingPageProps } from "./page"
import { assemblyDrawingPartViewProps } from "./partview"

export * from "./page"
export * from "./partview"

/** Drawing namespace; pages contain configured part views. */
export const assemblyDrawingProps = {
  page: assemblyDrawingPageProps,
  partview: assemblyDrawingPartViewProps,
} as const
