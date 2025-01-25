import {
  commonComponentProps,
  type CommonComponentProps,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface PushButtonProps extends CommonComponentProps {
  internallyConnectedPorts?: string[][]
}

export const pushButtonProps = commonComponentProps.extend({
  internallyConnectedPorts: z.array(z.array(z.string())).default([
    ["pin1", "pin4"],
    ["pin2", "pin3"],
  ]),
})
type InferredPushButtonProps = z.input<typeof pushButtonProps>

expectTypesMatch<PushButtonProps, InferredPushButtonProps>(true)
