import { distance } from "circuit-json"
import { connectionTarget } from "lib/common/connectionsProp"
import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import {
  type SchematicPinArrangement,
  schematicPinArrangement,
} from "lib/common/schematicPinDefinitions"
import type { SchematicPinLabel } from "lib/common/schematicPinLabel"
import {
  type SchematicPinStyle,
  schematicPinStyle,
} from "lib/common/schematicPinStyle"
import {
  noConnectProp,
  type PinLabelsProp,
  pinLabelsProp,
} from "lib/components/chip"
import { expectTypesMatch } from "lib/typecheck"
import type { Connections } from "lib/utility-types/connections-and-selectors"
import { z } from "zod"

export interface RotarySwitchProps extends CommonComponentProps {
  /**
   * Number of independent poles (decks). Defaults to 1.
   */
  poles?: number
  /**
   * Number of selectable positions (throws) per pole. Minimum 2.
   *
   * Physical pin numbering follows KiCad's `Switch:SW_Rotary_NxM` convention:
   * throw pins are `1 .. poles * positions` (`(pole - 1) * positions + pos`)
   * and common (wiper) pins are `poles * positions + 1 .. poles * (positions + 1)`.
   */
  positions: number
  /**
   * Selected 1-indexed position (`1 .. positions`) during analog simulation.
   * Sweepable with `<analog.sweepparameter parameterType="position" switchRef="..." />`.
   */
  simPosition?: number
  pinLabels?: PinLabelsProp<SchematicPinLabel>
  /**
   * Pin names or aliases intentionally left unconnected.
   */
  noConnect?: readonly SchematicPinLabel[] | SchematicPinLabel[]
  connections?: Connections<string>
  schPinArrangement?: SchematicPinArrangement
  schPinStyle?: SchematicPinStyle
  schWidth?: number | string
  schHeight?: number | string
}

export const rotarySwitchProps = commonComponentProps
  .extend({
    poles: z.number().int().min(1).optional().default(1),
    positions: z.number().int().min(2),
    simPosition: z.number().int().min(1).optional(),
    pinLabels: pinLabelsProp.optional(),
    noConnect: noConnectProp.optional(),
    connections: z
      .custom<Connections<string>>()
      .pipe(z.record(z.string(), connectionTarget))
      .optional(),
    schPinArrangement: schematicPinArrangement.optional(),
    schPinStyle: schematicPinStyle.optional(),
    schWidth: distance.optional(),
    schHeight: distance.optional(),
  })
  .superRefine((props, ctx) => {
    if (
      props.simPosition !== undefined &&
      props.simPosition > props.positions
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["simPosition"],
        message: `simPosition (${props.simPosition}) cannot exceed positions (${props.positions})`,
      })
    }
  })

export type InferredRotarySwitchProps = z.infer<typeof rotarySwitchProps>
expectTypesMatch<RotarySwitchProps, z.input<typeof rotarySwitchProps>>(true)
