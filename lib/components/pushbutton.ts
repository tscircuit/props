import {
    commonComponentProps,
  } from "lib/common/layout"
  import { z } from "zod"

export const pushButtonProps = commonComponentProps.extend({})
export type PushButtonProps = z.input<typeof pushButtonProps>