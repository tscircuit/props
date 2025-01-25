import {
  commonComponentProps,
  type CommonComponentProps,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface PushButtonProps extends CommonComponentProps {
  internallyConnectedPins?: string[][]
}

export const pushButtonProps = commonComponentProps.extend({
  internallyConnectedPins: z.array(z.array(z.string())).optional(),
})
type InferredPushButtonProps = z.input<typeof pushButtonProps>

expectTypesMatch<PushButtonProps, InferredPushButtonProps>(true)
