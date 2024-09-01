import { z } from "zod"
import { commonLayoutProps, type CommonLayoutProps } from "lib/common/layout"
import type { LayoutBuilder } from "@tscircuit/layout"
import { expectTypesMatch } from "lib/typecheck"

export interface GroupProps extends CommonLayoutProps {
  name?: string
  layout?: LayoutBuilder
  children?: any
  routingDisabled?: boolean
}

export const groupProps = commonLayoutProps.extend({
  name: z.string().optional(),
  layout: z.custom<LayoutBuilder>((v) => true).optional(),
  children: z.any().optional(),
  routingDisabled: z.boolean().optional(),
})

export type InferredGroupProps = z.input<typeof groupProps>
expectTypesMatch<GroupProps, InferredGroupProps>(true)
