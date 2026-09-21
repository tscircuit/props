import { z } from "zod"
import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import {
  schematicOrientation,
  type SchematicOrientation,
} from "lib/common/schematicOrientation"
import type { Connections } from "lib/utility-types/connections-and-selectors"
import { createConnectionsProp } from "lib/common/connectionsProp"
import { expectTypesMatch } from "lib/typecheck"

/**
 * Pin labels for fuse component
 */
export const fusePinLabels = ["pin1", "pin2"] as const

export type FusePinLabels = (typeof fusePinLabels)[number]

export interface FuseProps<PinLabel extends string = FusePinLabels>
  extends CommonComponentProps<PinLabel> {
  /**
   * Current rating of the fuse in amperes
   */
  currentRating: number | string

  /**
   * Voltage rating of the fuse
   */
  voltageRating?: number | string

  /**
   * Whether to show ratings on schematic
   */
  schShowRatings?: boolean

  schOrientation?: SchematicOrientation

  /**
   * Connections to other components
   */
  connections?: Connections<PinLabel>
}

/**
 * Schema for validating fuse props
 */
export const fuseProps = commonComponentProps.extend({
  currentRating: z.union([z.number(), z.string()]),
  voltageRating: z.union([z.number(), z.string()]).optional(),
  schShowRatings: z.boolean().optional(),
  schOrientation: schematicOrientation.optional(),
  connections: createConnectionsProp(fusePinLabels).optional(),
})

export type InferredFuseProps = z.input<typeof fuseProps>

expectTypesMatch<InferredFuseProps, FuseProps>(true)
