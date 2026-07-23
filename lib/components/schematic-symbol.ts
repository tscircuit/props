import { rotation } from "circuit-json"
import { connectionTarget } from "lib/common/connectionsProp"
import { distance, type Distance } from "lib/common/distance"
import { expectTypesMatch } from "lib/typecheck"
import type { Connections } from "lib/utility-types/connections-and-selectors"
import { z } from "zod"

/**
 * Places a named schematic-symbol representation of an existing physical
 * component. The connection keys are labels exposed by `symbolName`; each
 * value selects the corresponding port on the component referenced by
 * `chipRef`.
 *
 * This is a schematic-only projection, so it accepts only the identity,
 * connection, and schematic placement props it needs.
 */
export interface SchematicSymbolProps {
  /** Stable name for this representation, such as `A` or `B`. */
  name: string
  /** Optional human-facing name shown in the schematic. */
  displayName?: string
  /** Selector for the physical component represented by this symbol. */
  chipRef?: string
  /** Name of the symbol from the schematic-symbol library. */
  symbolName: string
  /** Maps symbol port labels to physical component port selectors. */
  connections?: Connections
  schX?: Distance
  schY?: Distance
  schRotation?: number | string
  schSectionName?: string
  schSheetName?: string
}

const schematicSymbolConnections = z
  .custom<Connections>()
  .pipe(z.record(z.string(), connectionTarget))
  .refine((value) => Object.keys(value).length > 0, {
    message: "connections must map at least one schematic symbol port",
  })

export const schematicSymbolProps = z.object({
  name: z.string().min(1),
  displayName: z.string().optional(),
  chipRef: z.string().min(1).optional(),
  symbolName: z.string().min(1),
  connections: schematicSymbolConnections.optional(),
  schX: distance.optional(),
  schY: distance.optional(),
  schRotation: rotation.optional(),
  schSectionName: z.string().optional(),
  schSheetName: z.string().optional(),
})

export type InferredSchematicSymbolProps = z.input<typeof schematicSymbolProps>

expectTypesMatch<SchematicSymbolProps, z.input<typeof schematicSymbolProps>>(
  true,
)
