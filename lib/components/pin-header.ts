import { distance } from "circuit-json"
import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import {
  schematicPinArrangement,
  type SchematicPinArrangement,
} from "lib/common/schematicPinDefinitions"
import {
  type SchematicPinStyle,
  schematicPinStyle,
} from "lib/common/schematicPinStyle"
import { connectionTarget } from "lib/common/connectionsProp"
import {
  schematicPinLabel,
  type SchematicPinLabel,
} from "lib/common/schematicPinLabel"
import {
  pcbOrientation as pcbOrientationProp,
  type PcbOrientation,
} from "lib/common/pcbOrientation"
import type { Connections } from "lib/utility-types/connections-and-selectors"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface PinHeaderProps extends CommonComponentProps {
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
   * Mount the header on the top of the board, so it is connected to from
   * above. An alias for `layer: "top"`, which is the default.
   *
   * Which side of the board a part sits on is `layer`, and only `layer`: the
   * 3D model is always drawn top-side and consumers flip it for a bottom-layer
   * component. Prefer these names on a connector, where "which side does the
   * mating connector come from" is the question actually being asked.
   */
  connectsFromAbove?: boolean

  /**
   * Mount the header on the underside of the board, so it is connected to from
   * below. An alias for `layer: "bottom"`.
   *
   * Not to be confused with `invert` on a footprint string, which installs a
   * header BACKWARDS on whichever side it is on — long pins through the board
   * rather than short ones.
   */
  connectsFromBelow?: boolean

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
   * @deprecated Use schPinStyle instead.
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

export const pinHeaderProps = commonComponentProps
  .extend({
    pinCount: z.number(),
    pitch: distance.optional(),
    schFacingDirection: z.enum(["up", "down", "left", "right"]).optional(),
    gender: z
      .enum(["male", "female", "unpopulated"])
      .optional()
      .default("male"),
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
    connectsFromAbove: z.boolean().optional(),
    connectsFromBelow: z.boolean().optional(),
  })
  // Resolved HERE rather than in each consumer: `layer` is read in dozens of
  // places downstream, and an alias that only some of them understand is worse
  // than no alias. After parsing there is one field to reason about again.
  .superRefine((props, ctx) => {
    if (props.connectsFromAbove && props.connectsFromBelow) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "connectsFromAbove and connectsFromBelow are opposites; set at most one",
      })
    }
  })
  .transform((props) => {
    const layer =
      props.layer ??
      (props.connectsFromBelow
        ? ("bottom" as const)
        : props.connectsFromAbove
          ? ("top" as const)
          : undefined)
    return layer === undefined ? props : { ...props, layer }
  })

type InferredPinHeaderProps = z.input<typeof pinHeaderProps>
expectTypesMatch<PinHeaderProps, InferredPinHeaderProps>(true)
