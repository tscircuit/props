import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import { type ChipProps, type PinLabelsProp, chipProps } from "./chip"

export interface PushButtonProps<T extends PinLabelsProp | string = string>
  extends Omit<ChipProps<T>, "name"> {
  name?: string
}

export const pushButtonProps = chipProps.omit({ name: true }).extend({
  name: z.string().optional(),
})

expectTypesMatch<PushButtonProps, z.input<typeof pushButtonProps>>(true)
