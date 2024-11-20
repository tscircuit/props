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
import type { AnySourceComponent, PcbTrace } from "circuit-json"

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

interface PcbRouteCache {
  pcbTraces: PcbTrace[]
  cacheKey: string
}

export interface AutorouterConfig {
  serverUrl?: string
  inputFormat?: "simplified" | "circuit-json"
  cache?: PcbRouteCache
}

export type AutorouterProp =
  | AutorouterConfig
  | "auto"
  | "auto-local"
  | "auto-cloud"

export const autorouterConfig = z.object({
  serverUrl: z.string().optional(),
  inputFormat: z.enum(["simplified", "circuit-json"]).optional(),
  cache: z.custom<PcbRouteCache>((v) => true).optional(),
})

export const autorouterProp = z.union([
  autorouterConfig,
  z.literal("auto"),
  z.literal("auto-local"),
  z.literal("auto-cloud"),
])

export interface SubcircuitGroupProps extends BaseGroupProps {
  layout?: LayoutBuilder
  manualEdits?: ManualEditFile
  routingDisabled?: boolean
  defaultTraceWidth?: Distance
  minTraceWidth?: Distance
  pcbRouteCache?: PcbRouteCache

  autorouter?: AutorouterProp

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

export interface NonSubcircuitGroupProps extends BaseGroupProps {
  subcircuit?: false | undefined
}

export type GroupProps = SubcircuitGroupPropsWithBool | NonSubcircuitGroupProps

export const baseGroupProps = commonLayoutProps.extend({
  name: z.string().optional(),
  children: z.any().optional(),
})

export const subcircuitGroupProps = baseGroupProps.extend({
  layout: z.custom<LayoutBuilder>((v) => true).optional(),
  manualEdits: z.custom<ManualEditFile>((v) => true).optional(),
  schAutoLayoutEnabled: z.boolean().optional(),
  routingDisabled: z.boolean().optional(),
  defaultTraceWidth: length.optional(),
  minTraceWidth: length.optional(),
  partsEngine: z.custom<PartsEngine>((v) => "findPart" in v).optional(),
  pcbRouteCache: z.custom<PcbRouteCache>((v) => true).optional(),
  autorouter: autorouterProp.optional(),
})

export const subcircuitGroupPropsWithBool = subcircuitGroupProps.extend({
  subcircuit: z.literal(true),
})

export const groupProps = z.discriminatedUnion("subcircuit", [
  baseGroupProps.extend({ subcircuit: z.literal(false).optional() }),
  subcircuitGroupPropsWithBool,
])

type InferredBaseGroupProps = z.input<typeof baseGroupProps>
type InferredSubcircuitGroupPropsWithBool = z.input<
  typeof subcircuitGroupPropsWithBool
>

expectTypesMatch<BaseGroupProps, InferredBaseGroupProps>(true)
expectTypesMatch<
  SubcircuitGroupPropsWithBool,
  InferredSubcircuitGroupPropsWithBool
>(true)

type InferredGroupProps = z.input<typeof groupProps>
expectTypesMatch<GroupProps, InferredGroupProps>(true)
