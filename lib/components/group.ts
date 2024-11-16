import type { LayoutBuilder, ManualEditFile } from "@tscircuit/layout"
import { length } from "circuit-json"
import type { Distance } from "lib/common/distance"
import {
  type CommonLayoutProps,
  commonLayoutProps,
  type SupplierPartNumbers,
} from "lib/common/layout"
import { expectTypesMatch } from "lib/typecheck"
import { z } from "zod"
import type { AnySourceComponent } from "circuit-json"

export interface BaseGroupProps extends CommonLayoutProps {
  name?: string
  children?: any
}

export type PartsEngine = {
  findPart: (params: {
    sourceComponent: AnySourceComponent
    footprinterString?: string
  }) => Promise<SupplierPartNumbers> | SupplierPartNumbers
}

export interface SubcircuitGroupProps extends BaseGroupProps {
  layout?: LayoutBuilder
  manualEdits?: ManualEditFile
  routingDisabled?: boolean
  defaultTraceWidth?: Distance
  minTraceWidth?: Distance

  /**
   * If true, we'll automatically layout the schematic for this group. Must be
   * a subcircuit (currently). This is eventually going to be replaced with more
   * sophisticated layout options/modes and will be enabled by default.
   */
  schAutoLayoutEnabled?: boolean

  partsEngine?: PartsEngine
}

export interface SubcircuitGroupPropsWithBool extends SubcircuitGroupProps {
  subcircuit: true
}

export type GroupProps = SubcircuitGroupPropsWithBool | BaseGroupProps

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
  minTraceWidth: length.optional(),
  partsEngine: z.custom<PartsEngine>((v) => "findPart" in v).optional(),
})

export const groupProps = z.union([baseGroupProps, subcircuitGroupProps])

type InferredBaseGroupProps = z.input<typeof baseGroupProps>
type InferredSubcircuitGroupProps = z.input<typeof subcircuitGroupProps>

expectTypesMatch<BaseGroupProps, InferredBaseGroupProps>(true)
expectTypesMatch<SubcircuitGroupProps, InferredSubcircuitGroupProps>(true)

type InferredGroupProps = z.input<typeof groupProps>
expectTypesMatch<GroupProps, InferredGroupProps>(true)
