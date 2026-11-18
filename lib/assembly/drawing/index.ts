import { assemblyDrawingExplosionViewProps } from "./explosionview"
import { assemblyDrawingNoteProps } from "./note"
import { assemblyDrawingPartLabelProps } from "./partlabel"
import { assemblyDrawingStageProps } from "./stage"
import { assemblyDrawingTitleBlockProps } from "./titleblock"
import { assemblyDrawingPageProps } from "./page"
import { assemblyDrawingPartViewProps } from "./partview"
import { assemblyDrawingDimensionProps } from "./dimension"
import { assemblyDrawingHarnessViewProps } from "./harnessview"
import { assemblyDrawingWiringTableProps } from "./wiringtable"
import { assemblyDrawingBomTableProps } from "./bomtable"

export * from "./page"
export * from "./page-size"
export * from "./titleblock"
export * from "./partview"
export * from "./dimension"

/** Drawing namespace; pages contain configured part views. */
export const assemblyDrawingProps = {
  note: assemblyDrawingNoteProps,
  partlabel: assemblyDrawingPartLabelProps,
  explosionview: assemblyDrawingExplosionViewProps,
  stage: assemblyDrawingStageProps,
  page: assemblyDrawingPageProps,
  titleblock: assemblyDrawingTitleBlockProps,
  partview: assemblyDrawingPartViewProps,
  dimension: assemblyDrawingDimensionProps,
  harnessview: assemblyDrawingHarnessViewProps,
  wiringtable: assemblyDrawingWiringTableProps,
  bomtable: assemblyDrawingBomTableProps,
} as const
export * from "./stage"
export * from "./partlabel"
export * from "./note"

export * from "./explosionview"

export type { AssemblyDrawingPaperPositionProps } from "./paper-position"

export * from "./harnessview"
export * from "./wiringtable"
export * from "./bomtable"
