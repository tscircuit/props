import type { LayoutBuilder } from "@tscircuit/layout"
import { layer_ref, length } from "circuit-json"
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

export const layoutConfig = z.object({
  layoutMode: z.enum(["grid", "flex", "match-adapt", "none"]).optional(),
  position: z.enum(["absolute", "relative"]).optional(),

  grid: z.boolean().optional(),
  gridCols: z.number().or(z.string()).optional(),
  gridRows: z.number().or(z.string()).optional(),
  gridTemplateRows: z.string().optional(),
  gridTemplateColumns: z.string().optional(),
  gridTemplate: z.string().optional(),
  gridGap: z.number().or(z.string()).optional(),

  flex: z.boolean().or(z.string()).optional(),
  flexDirection: z.enum(["row", "column"]).optional(),
  alignItems: z.enum(["start", "center", "end", "stretch"]).optional(),
  justifyContent: z.enum(["start", "center", "end", "stretch"]).optional(),
  flexRow: z.boolean().optional(),
  flexColumn: z.boolean().optional(),
  gap: z.number().or(z.string()).optional(),

  width: length.optional(),
  height: length.optional(),

  matchAdapt: z.boolean().optional(),
  matchAdaptTemplate: z.any().optional(),
})

export interface LayoutConfig {
  layoutMode?: "grid" | "flex" | "match-adapt" | "none"
  position?: "absolute" | "relative"

  grid?: boolean
  gridCols?: number | string
  gridRows?: number | string
  gridTemplateRows?: string
  gridTemplateColumns?: string
  gridTemplate?: string
  gridGap?: number | string

  flex?: boolean | string
  flexDirection?: "row" | "column"
  alignItems?: "start" | "center" | "end" | "stretch"
  justifyContent?: "start" | "center" | "end" | "stretch"
  flexRow?: boolean
  flexColumn?: boolean
  gap?: number | string

  width?: Distance
  height?: Distance

  matchAdapt?: boolean
  matchAdaptTemplate?: any
}

expectTypesMatch<LayoutConfig, z.input<typeof layoutConfig>>(true)

export interface Border {
  strokeWidth?: Distance
  dashed?: boolean
  solid?: boolean
}

export const border = z.object({
  strokeWidth: length.optional(),
  dashed: z.boolean().optional(),
  solid: z.boolean().optional(),
})

export interface BaseGroupProps extends CommonLayoutProps, LayoutConfig {
  name?: string
  key?: any
  children?: any

  pcbWidth?: Distance
  pcbHeight?: Distance
  schWidth?: Distance
  schHeight?: Distance

  pcbLayout?: LayoutConfig
  schLayout?: LayoutConfig
  cellBorder?: Border | null
  border?: Border | null
  schPadding?: Distance
  schPaddingLeft?: Distance
  schPaddingRight?: Distance
  schPaddingTop?: Distance
  schPaddingBottom?: Distance
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
  algorithmFn?: (simpleRouteJson: any) => Promise<any>
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
  algorithmFn: z
    .custom<(simpleRouteJson: any) => Promise<any>>(
      (v) => typeof v === "function" || v === undefined,
    )
    .optional(),
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

  ...layoutConfig.shape,
  pcbWidth: length.optional(),
  pcbHeight: length.optional(),
  schWidth: length.optional(),
  schHeight: length.optional(),
  pcbLayout: layoutConfig.optional(),
  schLayout: layoutConfig.optional(),
  cellBorder: border.nullable().optional(),
  border: border.nullable().optional(),
  schPadding: length.optional(),
  schPaddingLeft: length.optional(),
  schPaddingRight: length.optional(),
  schPaddingTop: length.optional(),
  schPaddingBottom: length.optional(),
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
