import { distance } from "circuit-json"
import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface TestpointProps extends CommonComponentProps {
  /**
   * The footprint variant of the testpoint either a surface pad or through-hole
   */
  footprintVariant?: "pad" | "through_hole"
  /**
   * The shape of the pad if using a pad variant
   */
  padShape?: "rect" | "circle"
  /**
   * Diameter of the copper pad (applies to both SMD pads and plated holes)
   */
  padDiameter?: number | string
  /**
   * Diameter of the hole if using a through-hole testpoint
   */
  holeDiameter?: number | string
  /**
   * Width of the pad when padShape is rect
   */
  width?: number | string
  /**
   * Height of the pad when padShape is rect
   */
  height?: number | string
  /**
   * When true, do not include a drilled hole even if using a through-hole footprint
   */
  withouthole?: boolean
}

export const testpointProps = commonComponentProps
  .extend({
    footprintVariant: z.enum(["pad", "through_hole"]).optional(),
    padShape: z.enum(["rect", "circle"]).optional().default("circle"),
    padDiameter: distance.optional(),
    holeDiameter: distance.optional(),
    width: distance.optional(),
    height: distance.optional(),
    withouthole: z.boolean().optional(),
  })
  .refine(
    (props) =>
      props.footprintVariant !== "through_hole" ||
      props.withouthole === true ||
      props.holeDiameter !== undefined,
    { message: "holeDiameter is required for through_hole testpoints" },
  )

export type InferredTestpointProps = z.input<typeof testpointProps>
expectTypesMatch<TestpointProps, InferredTestpointProps>(true)
