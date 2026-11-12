import { assemblyDrawingNoteProps } from "./note"
import { assemblyDrawingPartLabelProps } from "./partlabel"
import { assemblyDrawingExplosionProps } from "./explosion"
import { assemblyDrawingStageProps } from "./stage"
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
  note: assemblyDrawingNoteProps,
  partlabel: assemblyDrawingPartLabelProps,
  explosion: assemblyDrawingExplosionProps,
  stage: assemblyDrawingStageProps,
  page: assemblyDrawingPageProps,
  titleblock: assemblyDrawingTitleBlockProps,
  partview: assemblyDrawingPartViewProps,
  dimension: assemblyDrawingDimensionProps,
} as const
export * from "./stage"
export * from "./explosion"
export * from "./partlabel"
export * from "./note"
