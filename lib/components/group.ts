import type { LayoutBuilder } from "@tscircuit/layout"
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
import {
  manual_edits_file,
  type ManualEditsFile,
  type ManualEditsFileInput,
} from "lib/manual-edits"

export interface BaseGroupProps extends CommonLayoutProps {
  name?: string
  key?: any
  children?: any
}

export type PartsEngine = {
  findPart: (params: {
    sourceComponent: AnySourceComponent
    footprinterString?: string
  }) => Promise<SupplierPartNumbers> | SupplierPartNumbers
}

export interface PcbRouteCache {
  pcbTraces: PcbTrace[]
  cacheKey: string
}

export interface AutorouterConfig {
  serverUrl?: string
  inputFormat?: "simplified" | "circuit-json"
  serverMode?: "job" | "solve-endpoint"
  serverCacheEnabled?: boolean
  cache?: PcbRouteCache
  groupMode?: "sequential-trace" | "subcircuit"
  local?: boolean
}

export type AutorouterProp =
  | AutorouterConfig
  | "sequential-trace"
  | "subcircuit"
  | "auto"
  | "auto-local"
  | "auto-cloud"

export const autorouterConfig = z.object({
  serverUrl: z.string().optional(),
  inputFormat: z.enum(["simplified", "circuit-json"]).optional(),
  serverMode: z.enum(["job", "solve-endpoint"]).optional(),
  serverCacheEnabled: z.boolean().optional(),
  cache: z.custom<PcbRouteCache>((v) => true).optional(),
  groupMode: z.enum(["sequential-trace", "subcircuit"]).optional(),
  local: z.boolean().optional(),
})

export const autorouterProp = z.union([
  autorouterConfig,
  z.literal("sequential-trace"),
  z.literal("subcircuit"),
  z.literal("auto"),
  z.literal("auto-local"),
  z.literal("auto-cloud"),
])

export interface SubcircuitGroupProps extends BaseGroupProps {
  layout?: LayoutBuilder
  manualEdits?: ManualEditsFileInput
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

  /**
   * If true, net labels will automatically be created for complex traces
   */
  schTraceAutoLabelEnabled?: boolean

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
  key: z.any().optional(),

  layoutMode: z.enum(["grid", "flex", "none"]).optional(),
  pcbLayoutMode: z.enum(["grid", "manual", "none"]).optional(),
  schLayoutMode: z.enum(["grid", "flex", "none"]).optional(),

  grid: z.boolean().optional(),
  flex: z.boolean().optional(),

  cell: z.boolean().optional(),
})

export const partsEngine = z.custom<PartsEngine>((v) => "findPart" in v)

export const subcircuitGroupProps = baseGroupProps.extend({
  layout: z.custom<LayoutBuilder>((v) => true).optional(),
  manualEdits: manual_edits_file.optional(),
  schAutoLayoutEnabled: z.boolean().optional(),
  schTraceAutoLabelEnabled: z.boolean().optional(),
  routingDisabled: z.boolean().optional(),
  defaultTraceWidth: length.optional(),
  minTraceWidth: length.optional(),
  partsEngine: partsEngine.optional(),
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
