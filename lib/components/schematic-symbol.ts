import { connectionTarget } from "lib/common/connectionsProp"
import {
  commonComponentProps,
  type CommonComponentProps,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import type { Connections } from "lib/utility-types/connections-and-selectors"
import { z } from "zod"

/**
 * Places a named schematic-symbol representation of an existing physical
 * component. The connection keys are labels exposed by `symbolName`; each
 * value selects the corresponding port on the component referenced by
 * `chipRef`.
 *
 * Standard component props such as `displayName` and schematic placement are
 * inherited from `CommonComponentProps`.
 */
export interface SchematicSymbolProps extends CommonComponentProps {
  /** Selector for the physical component represented by this symbol. */
  chipRef?: string
  /** Name of the symbol from the schematic-symbol library. */
  symbolName: string
  /** Maps symbol port labels to physical component port selectors. */
  connections: Connections
}

const schematicSymbolConnections = z
  .custom<Connections>()
  .pipe(z.record(z.string(), connectionTarget))
  .refine((value) => Object.keys(value).length > 0, {
    message: "connections must map at least one schematic symbol port",
  })

export const schematicSymbolProps = commonComponentProps.extend({
  chipRef: z.string().min(1).optional(),
  symbolName: z.string().min(1),
  connections: schematicSymbolConnections,
})

export type InferredSchematicSymbolProps = z.input<typeof schematicSymbolProps>

expectTypesMatch<SchematicSymbolProps, z.input<typeof schematicSymbolProps>>(
  true,
)
