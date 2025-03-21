import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { chipProps, type ChipProps, type PinLabelsProp } from "./chip"

export type PushButtonProps<T extends PinLabelsProp | string = string> =
  ChipProps<T>

export const pushButtonProps = chipProps.extend({})

expectTypesMatch<PushButtonProps, z.input<typeof pushButtonProps>>(true)
