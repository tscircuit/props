import { chipProps, type ChipPropsSU } from "./chip"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export const connectorStandard = z.enum([
  "usb_c",
  "m2",
  "jst_sh",
  "jst_gh",
  "jst_zh",
  "jst_ph",
  "jst_xh",
  "jst_vh",
])

export type ConnectorStandard = z.infer<typeof connectorStandard>

export interface ConnectorProps extends ChipPropsSU {
  /**
   * Connector interface or product family, e.g. usb_c, m2, jst_ph
   */
  standard?: ConnectorStandard

  /**
   * Number of electrical circuits in the connector
   */
  pinCount?: number

  /**
   * Whether the connector must face a board edge for external access.
   * Set to false for internal board-to-flex or enclosure-internal sockets.
   */
  accessibleFromBoardEdge?: boolean
}

export const connectorProps = chipProps.extend({
  standard: connectorStandard.optional(),
  pinCount: z.number().int().positive().optional(),
  accessibleFromBoardEdge: z
    .boolean()
    .optional()
    .describe(
      "Whether the connector must face a board edge for external access. Set to false for internal board-to-flex or enclosure-internal sockets.",
    ),
})

type InferredConnectorProps = z.input<typeof connectorProps>
expectTypesMatch<ConnectorProps, InferredConnectorProps>(true)
