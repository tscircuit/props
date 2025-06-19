import { distance } from "circuit-json"
import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import {
  type SchematicPortArrangement,
  schematicPortArrangement,
} from "lib/common/schematicPinDefinitions"
import {
  type SchematicPinStyle,
  schematicPinStyle,
} from "lib/common/schematicPinStyle"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface ConnectorProps extends CommonComponentProps {
  manufacturerPartNumber?: string
  pinLabels?: Record<number | string, string | string[]>
  schPinStyle?: SchematicPinStyle
  schPinSpacing?: number | string
  schWidth?: number | string
  schHeight?: number | string
  schDirection?: "left" | "right"
  schPortArrangement?: SchematicPortArrangement
  /**
   * Groups of pins that are internally connected
   * e.g., [["1","2"], ["2","3"]]
   */
  internallyConnectedPins?: string[][]
  /**
   * Connector standard, e.g. usb_c, m2
   */
  standard?: "usb_c" | "m2"
}

export const connectorProps = commonComponentProps.extend({
  manufacturerPartNumber: z.string().optional(),
  pinLabels: z
    .record(z.number().or(z.string()), z.string().or(z.array(z.string())))
    .optional(),
  schPinStyle: schematicPinStyle.optional(),
  schPinSpacing: distance.optional(),
  schWidth: distance.optional(),
  schHeight: distance.optional(),
  schDirection: z.enum(["left", "right"]).optional(),
  schPortArrangement: schematicPortArrangement.optional(),
  internallyConnectedPins: z.array(z.array(z.string())).optional(),
  standard: z.enum(["usb_c", "m2"]).optional(),
})

type InferredConnectorProps = z.input<typeof connectorProps>
expectTypesMatch<ConnectorProps, InferredConnectorProps>(true)
