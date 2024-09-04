import { z } from "zod"
import { commonLayoutProps, type CommonLayoutProps } from "lib/common/layout"
import type { LayoutBuilder } from "@tscircuit/layout"
import { expectTypesMatch } from "lib/typecheck"

export interface BaseGroupProps extends CommonLayoutProps {
  name?: string
  children?: any
}

export interface SubcircuitGroupProps extends BaseGroupProps {
  subcircuit: true
  layout?: LayoutBuilder
  routingDisabled?: boolean
}

export type GroupProps = SubcircuitGroupProps | BaseGroupProps

export const baseGroupProps = commonLayoutProps.extend({
  name: z.string().optional(),
  children: z.any().optional(),
})

export const subcircuitGroupProps = baseGroupProps.extend({
  subcircuit: z.literal(true),
  layout: z.custom<LayoutBuilder>((v) => true).optional(),
  routingDisabled: z.boolean().optional(),
})

export const groupProps = z.union([baseGroupProps, subcircuitGroupProps])

type InferredBaseGroupProps = z.input<typeof baseGroupProps>
type InferredSubcircuitGroupProps = z.input<typeof subcircuitGroupProps>

expectTypesMatch<BaseGroupProps, InferredBaseGroupProps>(true)
expectTypesMatch<SubcircuitGroupProps, InferredSubcircuitGroupProps>(true)

type InferredGroupProps = z.input<typeof groupProps>
expectTypesMatch<GroupProps, InferredGroupProps>(true)
