import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { chipProps, type ChipProps } from "./chip"

export interface PushButtonProps extends ChipProps {}

export const pushButtonProps = chipProps.extend({})
type InferredPushButtonProps = z.input<typeof pushButtonProps>

expectTypesMatch<PushButtonProps, InferredPushButtonProps>(true)
