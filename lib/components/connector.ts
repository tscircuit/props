import { chipProps, type ChipPropsSU } from "./chip"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface ConnectorProps extends ChipPropsSU {
  /**
   * Connector standard, e.g. usb_c, m2
   */
  standard?: "usb_c" | "m2"
}

export const connectorProps = chipProps.extend({
  standard: z.enum(["usb_c", "m2"]).optional(),
})

type InferredConnectorProps = z.input<typeof connectorProps>
expectTypesMatch<ConnectorProps, InferredConnectorProps>(true)
