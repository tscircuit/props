import type { LayoutBuilder, ManualEditFile } from "@tscircuit/layout"
import { length } from "circuit-json"
import type { Distance } from "lib/common/distance"
import { type CommonLayoutProps, commonLayoutProps } from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"

export interface BaseGroupProps extends CommonLayoutProps {
  name?: string
  children?: any
}

export interface SubcircuitGroupProps extends BaseGroupProps {
  subcircuit: true
  layout?: LayoutBuilder
  manualEdits?: ManualEditFile
  routingDisabled?: boolean
  defaultTraceWidth?: Distance

  /**
   * If true, we'll automatically layout the schematic for this group. Must be
   * a subcircuit (currently). This is eventually going to be replaced with more
   * sophisticated layout options/modes and will be enabled by default.
   */
  schAutoLayoutEnabled?: boolean
}

export type GroupProps = SubcircuitGroupProps | BaseGroupProps

export const baseGroupProps = commonLayoutProps.extend({
  name: z.string().optional(),
  children: z.any().optional(),
})

export const subcircuitGroupProps = baseGroupProps.extend({
  subcircuit: z.literal(true),
  layout: z.custom<LayoutBuilder>((v) => true).optional(),
  manualEdits: z.custom<ManualEditFile>((v) => true).optional(),
  schAutoLayoutEnabled: z.boolean().optional(),
  routingDisabled: z.boolean().optional(),
  defaultTraceWidth: length.optional(),
})

export const groupProps = z.union([baseGroupProps, subcircuitGroupProps])

type InferredBaseGroupProps = z.input<typeof baseGroupProps>
type InferredSubcircuitGroupProps = z.input<typeof subcircuitGroupProps>

expectTypesMatch<BaseGroupProps, InferredBaseGroupProps>(true)
expectTypesMatch<SubcircuitGroupProps, InferredSubcircuitGroupProps>(true)

type InferredGroupProps = z.input<typeof groupProps>
expectTypesMatch<GroupProps, InferredGroupProps>(true)
