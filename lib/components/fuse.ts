import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import {
  type SchematicOrientation,
  schematicOrientation,
} from "lib/common/schematicOrientation"
import type { Connections } from "lib/utility-types/connections-and-selectors"
import { z } from "zod"

/**
 * Pin labels for fuse component
 */
export const fusePinLabels = ["pin1", "pin2"] as const

export type FusePinLabels = (typeof fusePinLabels)[number]

export interface FuseProps<PinLabel extends string = string>
  extends Omit<CommonComponentProps<PinLabel>, "name"> {
  name?: string
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
export const fuseProps = commonComponentProps.omit({ name: true }).extend({
  name: z.string().optional(),
  currentRating: z.union([z.number(), z.string()]),
  voltageRating: z.union([z.number(), z.string()]).optional(),
  schShowRatings: z.boolean().optional(),
  schOrientation: schematicOrientation.optional(),
  connections: z
    .record(
      z.string(),
      z.union([
        z.string(),
        z.array(z.string()).readonly(),
        z.array(z.string()),
      ]),
    )
    .optional(),
})

export type InferredFuseProps = z.input<typeof fuseProps>
