import { z } from "zod"
import { distance } from "@tscircuit/soup"
import {
  commonComponentProps,
  type CommonComponentProps,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"

export interface HeaderProps extends CommonComponentProps {
  /**
   * Number of pins in the header
   */
  pinCount: number

  /**
   * Distance between pins
   */
  pitch?: number | string

  /**
   * Whether the header is male or female
   */
  gender?: "male" | "female"

  /**
   * Whether to show pin labels in silkscreen
   */
  showSilkscreenPinLabels?: boolean

  /**
   * Whether the header has two rows of pins
   */
  doubleRow?: boolean

  /**
   * Diameter of the through-hole for each pin
   */
  holeDiameter?: number | string

  /**
   * Diameter of the plated area around each hole
   */
  platedDiameter?: number | string
}

export const headerProps = commonComponentProps.extend({
  pinCount: z.number(),
  pitch: distance.optional(),
  gender: z.enum(["male", "female"]).optional(),
  showSilkscreenPinLabels: z.boolean().optional(),
  doubleRow: z.boolean().optional(),
  holeDiameter: distance.optional(),
  platedDiameter: distance.optional(),
})

type InferredHeaderProps = z.input<typeof headerProps>
expectTypesMatch<HeaderProps, InferredHeaderProps>(true)
