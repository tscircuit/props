import {
  chipProps,
  type ChipProps,
  type PinLabelsProp,
} from "lib/components/chip"
import type { z } from "zod"
import { expectTypesMatch } from "lib/typecheck"

export const pinoutProps = chipProps
export interface PinoutProps<
  PinLabelMap extends PinLabelsProp | string = string,
> extends ChipProps<PinLabelMap> {}

type InferredPinoutProps = z.input<typeof pinoutProps>
expectTypesMatch<InferredPinoutProps, PinoutProps>(true)
