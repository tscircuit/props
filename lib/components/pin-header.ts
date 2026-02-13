import { distance } from "circuit-json"
import { connectionTarget } from "lib/common/connectionsProp"
import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import {
  type PcbOrientation,
  pcbOrientation as pcbOrientationProp,
} from "lib/common/pcbOrientation"
import {
  type SchematicPinArrangement,
  schematicPinArrangement,
} from "lib/common/schematicPinDefinitions"
import {
  type SchematicPinLabel,
  schematicPinLabel,
} from "lib/common/schematicPinLabel"
import {
  type SchematicPinStyle,
  schematicPinStyle,
} from "lib/common/schematicPinStyle"
import { expectTypesMatch } from "lib/typecheck"
import type { Connections } from "lib/utility-types/connections-and-selectors"
import { z } from "zod"

export interface PinHeaderProps extends Omit<CommonComponentProps, "name"> {
  name?: string
  /**
   * Number of pins in the header
   */
  pinCount: number

  /**
   * Distance between pins
   */
  pitch?: number | string

  /**
   * Schematic facing direction
   */
  schFacingDirection?: "up" | "down" | "left" | "right"

  /**
   * Whether the header is male, female, or unpopulated
   */
  gender?: "male" | "female" | "unpopulated"

  /**
   * Whether to show pin labels in silkscreen
   */
  showSilkscreenPinLabels?: boolean

  /**
   * Labels for PCB pins
   */
  pcbPinLabels?: Record<string, string>

  /**
   * Whether the header has two rows of pins
   */
  doubleRow?: boolean

  /**
   * If true, the header is a right-angle style connector
   */
  rightAngle?: boolean

  /**
   * Orientation of the header on the PCB
   */
  pcbOrientation?: PcbOrientation

  /**
   * Diameter of the through-hole for each pin
   */
  holeDiameter?: number | string

  /**
   * Diameter of the plated area around each hole
   */
  platedDiameter?: number | string

  /**
   * Labels for each pin
   */
  pinLabels?: Record<string, SchematicPinLabel> | SchematicPinLabel[]

  /**
   * Connections to other components
   */
  connections?: Connections<string>

  /**
   * Direction the header is facing
   */
  facingDirection?: "left" | "right"

  /**
   * Pin arrangement in schematic view
   */
  schPinArrangement?: SchematicPinArrangement

  /**
   * Schematic pin style (margins, etc)
   */
  schPinStyle?: SchematicPinStyle

  /**
   * Schematic pin spacing
   */
  schPinSpacing?: number | string

  /**
   * Schematic width
   */
  schWidth?: number | string

  /**
   * Schematic height
   */
  schHeight?: number | string
}

export const pinHeaderProps = commonComponentProps.omit({ name: true }).extend({
  name: z.string().optional(),
  pinCount: z.number(),
  pitch: distance.optional(),
  schFacingDirection: z.enum(["up", "down", "left", "right"]).optional(),
  gender: z.enum(["male", "female", "unpopulated"]).optional().default("male"),
  showSilkscreenPinLabels: z.boolean().optional(),
  pcbPinLabels: z.record(z.string(), z.string()).optional(),
  doubleRow: z.boolean().optional(),
  rightAngle: z.boolean().optional(),
  pcbOrientation: pcbOrientationProp.optional(),
  holeDiameter: distance.optional(),
  platedDiameter: distance.optional(),
  pinLabels: z
    .record(z.string(), schematicPinLabel)
    .or(z.array(schematicPinLabel))
    .optional(),
  connections: z
    .custom<Connections>()
    .pipe(z.record(z.string(), connectionTarget))
    .optional(),
  facingDirection: z.enum(["left", "right"]).optional(),
  schPinArrangement: schematicPinArrangement.optional(),
  schPinStyle: schematicPinStyle.optional(),
  schPinSpacing: distance.optional(),
  schWidth: distance.optional(),
  schHeight: distance.optional(),
})

type InferredPinHeaderProps = z.input<typeof pinHeaderProps>
expectTypesMatch<PinHeaderProps, InferredPinHeaderProps>(true)
