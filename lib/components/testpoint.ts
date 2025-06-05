import { distance } from "circuit-json"
import {
  type CommonComponentProps,
  commonComponentProps,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface TestpointProps extends CommonComponentProps {
  /**
   * The variant of testpoint either surface-mount (smd) or through-hole
   */
  variant?: "smd" | "through_hole"
  /**
   * Diameter of the copper test point or pad
   */
  diameter: number | string
  /**
   * Diameter of the hole if using a through-hole testpoint
   */
  holeDiameter?: number | string
}

export const testpointProps = commonComponentProps
  .extend({
    variant: z.enum(["smd", "through_hole"]).optional().default("smd"),
    diameter: distance,
    holeDiameter: distance.optional(),
  })
  .refine(
    (props) => props.variant === "smd" || props.holeDiameter !== undefined,
    { message: "holeDiameter is required for through_hole testpoints" },
  )

export type InferredTestpointProps = z.input<typeof testpointProps>
expectTypesMatch<TestpointProps, InferredTestpointProps>(true)
