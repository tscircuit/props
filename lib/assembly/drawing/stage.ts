import { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"

/** Drawing-only part selection, resolved by core into source IDs and PCB board IDs. */
export interface AssemblyDrawingSelection {
  /** Component selectors; a populated board can be composed with its fitted parts. */
  partRefs?: string[]
  /** Board substrate selectors, not just the board's fitted components. */
  boardRefs?: string[]
  /** Named drawing stage selectors to include as a set; references must be acyclic. */
  includeStageRefs?: string[]
}
const refs = z.array(z.string().trim().min(1)).min(1)
export const assemblyDrawingSelection = z.object({
  partRefs: refs.optional(),
  boardRefs: refs.optional(),
  includeStageRefs: refs.optional(),
})
export const hasAssemblyDrawingSelection = (s: AssemblyDrawingSelection) =>
  Boolean(
    s.partRefs?.length || s.boardRefs?.length || s.includeStageRefs?.length,
  )
export interface AssemblyDrawingStageProps extends AssemblyDrawingSelection {
  /** Stable identity for stageRef/includeStageRefs. No implicit playback order. */
  name: string
  displayName?: string
}
export const assemblyDrawingStageProps = assemblyDrawingSelection
  .extend({
    name: z.string().trim().min(1),
    displayName: z.string().optional(),
  })
  .refine(
    hasAssemblyDrawingSelection,
    "Provide at least one of partRefs, boardRefs or includeStageRefs",
  )
expectTypesMatch<
  AssemblyDrawingSelection,
  z.input<typeof assemblyDrawingSelection>
>(true)
expectTypesMatch<
  AssemblyDrawingStageProps,
  z.input<typeof assemblyDrawingStageProps>
>(true)
