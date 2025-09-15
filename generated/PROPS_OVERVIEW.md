# @tscircuit/props Overview

> Generated at 2025-09-14T18:16:33.787Z
> Latest version: https://github.com/tscircuit/props/blob/main/generated/PROPS_OVERVIEW.md

This document provides an overview of all the prop types available in @tscircuit/props.
Each interface has a corresponding zod validator that can be imported from the package.

For example, for `ChipProps` there is a `chipProps` zod validator:

```ts
import { chipProps, type ChipProps } from "@tscircuit/props"

// Validate/parse props
const validatedProps = chipProps.parse(unknownProps)
```

## Available Props

```ts
export interface AutorouterConfig {
  serverUrl?: string
  inputFormat?: "simplified" | "circuit-json"
  serverMode?: "job" | "solve-endpoint"
  serverCacheEnabled?: boolean
  cache?: PcbRouteCache
  traceClearance?: Distance
  groupMode?:
    | "sequential_trace"
    | "subcircuit"
    | /** @deprecated Use "sequential_trace" */ "sequential-trace"
  local?: boolean
  algorithmFn?: (simpleRouteJson: any) => Promise<any>
  preset?:
    | "sequential_trace"
    | "subcircuit"
    | "auto"
    | "auto_local"
    | "auto_cloud"
    | "freerouting"
    | /** @deprecated Use "sequential_trace" */ "sequential-trace"
    | /** @deprecated Use "auto_local" */ "auto-local"
    | /** @deprecated Use "auto_cloud" */ "auto-cloud"
}


export interface BaseGroupProps extends CommonLayoutProps, LayoutConfig {
  name?: string
  key?: any
  children?: any

  /**
   * Title to display above this group in the schematic view
   */
  schTitle?: string

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

  pcbPadding?: Distance
  pcbPaddingLeft?: Distance
  pcbPaddingRight?: Distance
  pcbPaddingTop?: Distance
  pcbPaddingBottom?: Distance

  /** @deprecated Use `pcbGrid` */
  grid?: boolean
  /** @deprecated Use `pcbFlex` */
  flex?: boolean | string

  pcbGrid?: boolean
  pcbGridCols?: number | string
  pcbGridRows?: number | string
  pcbGridTemplateRows?: string
  pcbGridTemplateColumns?: string
  pcbGridTemplate?: string
  pcbGridGap?: number | string
  pcbGridRowGap?: number | string
  pcbGridColumnGap?: number | string

  pcbFlex?: boolean | string
  pcbFlexGap?: number | string
  pcbFlexDirection?: "row" | "column"
  pcbAlignItems?: "start" | "center" | "end" | "stretch"
  pcbJustifyContent?:
    | "start"
    | "center"
    | "end"
    | "stretch"
    | "space-between"
    | "space-around"
    | "space-evenly"
  pcbFlexRow?: boolean
  pcbFlexColumn?: boolean
  pcbGap?: number | string
  pcbPack?: boolean
  pcbPackGap?: number | string

  schGrid?: boolean
  schGridCols?: number | string
  schGridRows?: number | string
  schGridTemplateRows?: string
  schGridTemplateColumns?: string
  schGridTemplate?: string
  schGridGap?: number | string
  schGridRowGap?: number | string
  schGridColumnGap?: number | string

  schFlex?: boolean | string
  schFlexGap?: number | string
  schFlexDirection?: "row" | "column"
  schAlignItems?: "start" | "center" | "end" | "stretch"
  schJustifyContent?:
    | "start"
    | "center"
    | "end"
    | "stretch"
    | "space-between"
    | "space-around"
    | "space-evenly"
  schFlexRow?: boolean
  schFlexColumn?: boolean
  schGap?: number | string
  schPack?: boolean
  schMatchAdapt?: boolean
}


export interface BaseManualEditEvent {
  edit_event_id: string
  in_progress?: boolean
  created_at: number
}


export interface BatteryProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  capacity?: number | string
  voltage?: number | string
  standard?: "AA" | "AAA" | "9V" | "CR2032" | "18650" | "C"
  schOrientation?: SchematicOrientation
}


export interface BoardProps extends Omit<SubcircuitGroupProps, "subcircuit"> {
  material?: "fr4" | "fr1"
  /** Number of layers for the PCB */
  layers?: 2 | 4
  borderRadius?: Distance
}


export interface Border {
  strokeWidth?: Distance
  dashed?: boolean
  solid?: boolean
}


export interface BreakoutPointProps
  extends Omit<PcbLayoutProps, "pcbRotation" | "layer"> {
  connection: string
}


export interface BreakoutProps
  extends Omit<SubcircuitGroupProps, "subcircuit"> {
  padding?: Distance
  paddingLeft?: Distance
  paddingRight?: Distance
  paddingTop?: Distance
  paddingBottom?: Distance
}


export interface CadAssemblyProps {
  /**
   * The layer that the CAD assembly is designed for. If you set this to "top"
   * then it means the children were intended to represent the top layer. If
   * the <chip /> with this assembly is moved to the bottom layer, then the
   * components will be mirrored.
   *
   * Generally, you shouldn't set this except where it can help prevent
   * confusion because you have a complex multi-layer assembly. Default is
   * "top" and this is most intuitive.
   */
  originalLayer?: LayerRef

  children?: any
}


export interface CadModelBase {
  rotationOffset?:
    | number
    | { x: number | string; y: number | string; z: number | string }
  positionOffset?: {
    x: number | string
    y: number | string
    z: number | string
  }
  size?: { x: number | string; y: number | string; z: number | string }
  modelUnitToMmScale?: Distance
}


export interface CadModelGlb extends CadModelBase {
  glbUrl: string
}


export interface CadModelGltf extends CadModelBase {
  gltfUrl: string
}


export interface CadModelJscad extends CadModelBase {
  jscad: Record<string, any>
}


export interface CadModelObj extends CadModelBase {
  objUrl: string
  mtlUrl?: string
}


export interface CadModelProps extends CadModelBase {
  modelUrl: string
  pcbX?: Distance
  pcbY?: Distance
  pcbZ?: Distance
}


export interface CadModelStep extends CadModelBase {
  stepUrl: string
}


export interface CadModelStl extends CadModelBase {
  stlUrl: string
}


export interface CadModelWrl extends CadModelBase {
  wrlUrl: string
}


export interface CapacitorProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  capacitance: number | string
  maxVoltageRating?: number | string
  schShowRatings?: boolean
  polarized?: boolean
  decouplingFor?: string
  decouplingTo?: string
  bypassFor?: string
  bypassTo?: string
  maxDecouplingTraceLength?: number
  schOrientation?: SchematicOrientation
  connections?: Connections<CapacitorPinLabels>
}


export interface ChipPropsSU<
  PinLabel extends SchematicPinLabel = SchematicPinLabel,
> extends CommonComponentProps<PinLabel> {
  manufacturerPartNumber?: string
  pinLabels?: PinLabelsProp<SchematicPinLabel, PinLabel>
  /**
   * Whether to show pin aliases in the schematic
   */
  showPinAliases?: boolean
  /**
   * Labels for PCB pins
   */
  pcbPinLabels?: Record<string, string>
  schPinArrangement?: SchematicPortArrangement
  /** @deprecated Use schPinArrangement instead. */
  schPortArrangement?: SchematicPortArrangement
  pinCompatibleVariants?: PinCompatibleVariant[]
  schPinStyle?: SchematicPinStyle
  schPinSpacing?: Distance
  schWidth?: Distance
  schHeight?: Distance
  noSchematicRepresentation?: boolean
  internallyConnectedPins?: (string | number)[][]
  externallyConnectedPins?: string[][]
  connections?: Connections<PinLabel>
}


export interface CircleCutoutProps
  extends Omit<PcbLayoutProps, "layer" | "pcbRotation"> {
  name?: string
  shape: "circle"
  radius: Distance
}


export interface CirclePlatedHoleProps
  extends Omit<PcbLayoutProps, "pcbRotation" | "layer"> {
  name?: string
  connectsTo?: string | string[]
  shape: "circle"
  holeDiameter: number | string
  outerDiameter: number | string
  portHints?: PortHints
}


export interface CircleHoleProps extends PcbLayoutProps {
  name?: string
  shape?: "circle"
  diameter?: Distance
  radius?: Distance
}


export interface CircleSmtPadProps extends Omit<PcbLayoutProps, "pcbRotation"> {
  name?: string
  shape: "circle"
  radius: Distance
  portHints?: PortHints
}


export interface CircleSolderPasteProps
  extends Omit<PcbLayoutProps, "pcbRotation"> {
  shape: "circle"
  radius: Distance
}


export interface CircularHoleWithRectPlatedProps
  extends Omit<PcbLayoutProps, "pcbRotation" | "layer"> {
  name?: string
  connectsTo?: string | string[]
  shape: "circular_hole_with_rect_pad"
  holeDiameter: number | string
  rectPadWidth: number | string
  rectPadHeight: number | string
  holeShape?: "circle"
  padShape?: "rect"
  portHints?: PortHints
  pcbHoleOffsetX?: number | string
  pcbHoleOffsetY?: number | string
}


export interface CommonComponentProps<PinLabel extends string = string>
  extends CommonLayoutProps {
  key?: any
  name: string
  pinAttributes?: Record<PinLabel, PinAttributeMap>
  supplierPartNumbers?: SupplierPartNumbers
  cadModel?: CadModelProp
  children?: any
  symbolName?: string
  doNotPlace?: boolean
}


export interface CommonLayoutProps {
  pcbX?: string | number
  pcbY?: string | number
  pcbRotation?: string | number
  pcbPositionAnchor?: string

  pcbMarginTop?: string | number
  pcbMarginRight?: string | number
  pcbMarginBottom?: string | number
  pcbMarginLeft?: string | number
  pcbMarginX?: string | number
  pcbMarginY?: string | number

  schMarginTop?: string | number
  schMarginRight?: string | number
  schMarginBottom?: string | number
  schMarginLeft?: string | number
  schMarginX?: string | number
  schMarginY?: string | number

  schX?: string | number
  schY?: string | number
  schRotation?: string | number

  layer?: LayerRefInput
  footprint?: FootprintProp
  symbol?: SymbolProp

  /**
   * If true, X/Y coordinates will be interpreted relative to the parent group
   */
  relative?: boolean

  /**
   * If true, schX/schY will be interpreted relative to the parent group
   */
  schRelative?: boolean

  /**
   * If true, pcbX/pcbY will be interpreted relative to the parent group
   */
  pcbRelative?: boolean
}


export interface ConnectorProps extends CommonComponentProps {
  manufacturerPartNumber?: string
  pinLabels?: Record<
    number | SchematicPinLabel,
    SchematicPinLabel | SchematicPinLabel[]
  >
  schPinStyle?: SchematicPinStyle
  schPinSpacing?: number | string
  schWidth?: number | string
  schHeight?: number | string
  schDirection?: "left" | "right"
  schPortArrangement?: SchematicPortArrangement
  /**
   * Groups of pins that are internally connected
   * e.g., [["1","2"], ["2","3"]]
   */
  internallyConnectedPins?: (string | number)[][]
  /**
   * Connector standard, e.g. usb_c, m2
   */
  standard?: "usb_c" | "m2"
}


export interface ConstrainedLayoutProps {
  name?: string
  pcbOnly?: boolean
  schOnly?: boolean
}


export interface CopperPourProps {
  name?: string
  layer: LayerRefInput
  connectsTo: string
  padMargin?: Distance
  traceMargin?: Distance
}


export interface CrystalProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  frequency: number | string
  loadCapacitance: number | string
  manufacturerPartNumber?: string
  mpn?: string
  pinVariant?: PinVariant
  schOrientation?: SchematicOrientation
  connections?: Connections<CrystalPinLabels>
}


export interface DiodeProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  connections?: {
    anode?: string | string[] | readonly string[]
    cathode?: string | string[] | readonly string[]
    pin1?: string | string[] | readonly string[]
    pin2?: string | string[] | readonly string[]
    pos?: string | string[] | readonly string[]
    neg?: string | string[] | readonly string[]
  }
  variant?: "standard" | "schottky" | "zener" | "avalanche" | "photo" | "tvs"
  standard?: boolean
  schottky?: boolean
  zener?: boolean
  avalanche?: boolean
  photo?: boolean
  tvs?: boolean
  schOrientation?: SchematicOrientation
}


export interface EditPcbComponentLocationEvent extends BaseManualEditEvent {
  edit_event_type: "edit_pcb_component_location"
  /** @deprecated */
  pcb_edit_event_type: "edit_component_location"
  pcb_component_id: string
  original_center: { x: number; y: number }
  new_center: { x: number; y: number }
}


export interface EditPcbGroupLocationEvent extends BaseManualEditEvent {
  edit_event_type: "edit_pcb_group_location"
  pcb_group_id: string
  original_center: { x: number; y: number }
  new_center: { x: number; y: number }
}


export interface EditSchematicComponentLocationEvent
  extends BaseManualEditEvent {
  edit_event_type: "edit_schematic_component_location"
  schematic_component_id: string
  original_center: { x: number; y: number }
  new_center: { x: number; y: number }
}


export interface EditSchematicGroupLocationEvent extends BaseManualEditEvent {
  edit_event_type: "edit_schematic_group_location"
  schematic_group_id: string
  original_center: { x: number; y: number }
  new_center: { x: number; y: number }
}


export interface EditTraceHintEvent extends BaseManualEditEvent {
  /** @deprecated */
  pcb_edit_event_type: "edit_trace_hint"
  edit_event_type?: "edit_pcb_trace_hint"
  pcb_port_id: string
  pcb_trace_hint_id?: string
  route: Array<{ x: number; y: number; via?: boolean }>
}


export interface FootprintLibraryResult {
  footprintCircuitJson: any[]
  cadModel?: CadModelProp
}


export interface FootprintProps {
  /**
   * The layer that the footprint is designed for. If you set this to "top"
   * then it means the children were intended to represent the top layer. If
   * the <chip /> with this footprint is moved to the bottom layer, then the
   * components will be mirrored.
   *
   * Generally, you shouldn't set this except where it can help prevent
   * confusion because you have a complex multi-layer footprint. Default is
   * "top" and this is most intuitive.
   */
  originalLayer?: LayerRef
}


export interface FuseProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  /**
   * Current rating of the fuse in amperes
   */
  currentRating: number | string

  /**
   * Voltage rating of the fuse
   */
  voltageRating?: number | string

  /**
   * Whether to show ratings on schematic
   */
  schShowRatings?: boolean

  schOrientation?: SchematicOrientation

  /**
   * Connections to other components
   */
  connections?: Connections<PinLabel>
}


export type HoleProps = CircleHoleProps | PillHoleProps


export interface InductorProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  inductance: number | string
  maxCurrentRating?: number | string
  schOrientation?: SchematicOrientation
  connections?: Connections<InductorPinLabels>
}


export interface JumperProps extends CommonComponentProps {
  manufacturerPartNumber?: string
  pinLabels?: Record<
    number | SchematicPinLabel,
    SchematicPinLabel | SchematicPinLabel[]
  >
  schPinStyle?: SchematicPinStyle
  schPinSpacing?: number | string
  schWidth?: number | string
  schHeight?: number | string
  schDirection?: "left" | "right"
  schPinArrangement?: SchematicPortArrangement
  /**
   * @deprecated Use schPinArrangement instead.
   */
  schPortArrangement?: SchematicPortArrangement
  /**
   * Labels for PCB pins
   */
  pcbPinLabels?: Record<string, string>
  /**
   * Number of pins on the jumper (2 or 3)
   */
  pinCount?: 2 | 3
  /**
   * Groups of pins that are internally connected
   * e.g., [["1","2"], ["2","3"]]
   */
  internallyConnectedPins?: (string | number)[][]
  /**
   * Connections to other components
   */
  connections?: Connections<string>
}


export interface LayoutConfig {
  layoutMode?: "grid" | "flex" | "match-adapt" | "relative" | "none"
  position?: "absolute" | "relative"

  grid?: boolean
  gridCols?: number | string
  gridRows?: number | string
  gridTemplateRows?: string
  gridTemplateColumns?: string
  gridTemplate?: string
  gridGap?: number | string
  gridRowGap?: number | string
  gridColumnGap?: number | string

  flex?: boolean | string
  flexDirection?: "row" | "column"
  alignItems?: "start" | "center" | "end" | "stretch"
  justifyContent?:
    | "start"
    | "center"
    | "end"
    | "stretch"
    | "space-between"
    | "space-around"
    | "space-evenly"
  flexRow?: boolean
  flexColumn?: boolean
  gap?: number | string

  pack?: boolean
  packOrderStrategy?:
    | "largest_to_smallest"
    | "first_to_last"
    | "highest_to_lowest_pin_count"
  packPlacementStrategy?: "shortest_connection_along_outline"

  padding?: Distance
  paddingLeft?: Distance
  paddingRight?: Distance
  paddingTop?: Distance
  paddingBottom?: Distance
  paddingX?: Distance
  paddingY?: Distance

  width?: Distance
  height?: Distance

  matchAdapt?: boolean
  matchAdaptTemplate?: any
}


export interface ManualEditsFile {
  pcb_placements?: ManualPcbPlacement[]
  manual_trace_hints?: ManualTraceHint[]
  schematic_placements?: ManualSchematicPlacement[]
}


export interface ManualPcbPlacement {
  selector: string
  relative_to: string
  center: Point
}


export interface ManualSchematicPlacement {
  selector: string
  relative_to: string
  center: Point
}


export interface ManualTraceHint {
  pcb_port_selector: string
  offsets: Array<RouteHintPoint>
}


export interface MosfetProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  channelType: "n" | "p"
  mosfetMode: "enhancement" | "depletion"
}


export interface NetAliasProps {
  net?: string
  connection?: string
  schX?: number | string
  schY?: number | string
  schRotation?: number | string
  anchorSide?: "left" | "top" | "right" | "bottom"
}


export interface NetLabelProps {
  net?: string
  connection?: string
  connectsTo?: string | string[]
  schX?: number | string
  schY?: number | string
  schRotation?: number | string
  anchorSide?: "left" | "top" | "right" | "bottom"
}


export interface NetProps {
  name: string
  connectsTo?: string | string[]
}


export interface NonSubcircuitGroupProps extends BaseGroupProps {
  subcircuit?: false | undefined
}


export interface OvalPlatedHoleProps
  extends Omit<PcbLayoutProps, "pcbRotation" | "layer"> {
  name?: string
  connectsTo?: string | string[]
  shape: "oval"
  outerWidth: number | string
  outerHeight: number | string
  holeWidth: number | string
  holeHeight: number | string
  portHints?: PortHints

  /** @deprecated use holeWidth */
  innerWidth?: number | string
  /** @deprecated use holeHeight */
  innerHeight?: number | string
}


export interface PcbLayoutProps {
  pcbX?: string | number
  pcbY?: string | number
  pcbRotation?: string | number
  pcbPositionAnchor?: string
  layer?: LayerRefInput
  pcbMarginTop?: string | number
  pcbMarginRight?: string | number
  pcbMarginBottom?: string | number
  pcbMarginLeft?: string | number
  pcbMarginX?: string | number
  pcbMarginY?: string | number
  /**
   * If true, pcbX/pcbY will be interpreted relative to the parent group
   */
  pcbRelative?: boolean
  /**
   * If true, both pcb and schematic coordinates will be interpreted relative to the parent group
   */
  relative?: boolean
}


export interface PcbRouteCache {
  pcbTraces: PcbTrace[]
  cacheKey: string
}


export interface PillHoleProps extends PcbLayoutProps {
  name?: string
  shape: "pill"
  width: Distance
  height: Distance
}


export interface PillPlatedHoleProps extends Omit<PcbLayoutProps, "layer"> {
  name?: string
  rectPad?: boolean
  connectsTo?: string | string[]
  shape: "pill"
  outerWidth: number | string
  outerHeight: number | string
  holeWidth: number | string
  holeHeight: number | string

  /** @deprecated use holeWidth */
  innerWidth?: number | string
  /** @deprecated use holeHeight */
  innerHeight?: number | string

  portHints?: PortHints
}


export interface PillSmtPadProps extends Omit<PcbLayoutProps, "pcbRotation"> {
  name?: string
  shape: "pill"
  width: Distance
  height: Distance
  radius: Distance
  portHints?: PortHints
}


export interface PillWithRectPadPlatedHoleProps
  extends Omit<PcbLayoutProps, "pcbRotation" | "layer"> {
  name?: string
  connectsTo?: string | string[]
  shape: "pill_hole_with_rect_pad"
  holeShape: "pill"
  padShape: "rect"
  holeWidth: number | string
  holeHeight: number | string
  rectPadWidth: number | string
  rectPadHeight: number | string
  portHints?: PortHints
}


export interface PinAttributeMap {
  providesPower?: boolean
  requiresPower?: boolean
  providesGround?: boolean
  requiresGround?: boolean
  providesVoltage?: string | number
  requiresVoltage?: string | number
  doNotConnect?: boolean
  includeInBoardPinout?: boolean
}


export interface PinCompatibleVariant {
  manufacturerPartNumber?: string
  supplierPartNumber?: SupplierPartNumbers
}


export interface PinHeaderProps extends CommonComponentProps {
  /**
   * Number of pins in the header
   */
  pinCount: number

  /**
   * Distance between pins
   */
  pitch?: number | string

  /**
   * Schematic facing direction
   */
  schFacingDirection?: "up" | "down" | "left" | "right"

  /**
   * Whether the header is male, female, or unpopulated
   */
  gender?: "male" | "female" | "unpopulated"

  /**
   * Whether to show pin labels in silkscreen
   */
  showSilkscreenPinLabels?: boolean

  /**
   * Labels for PCB pins
   */
  pcbPinLabels?: Record<string, string>

  /**
   * Whether the header has two rows of pins
   */
  doubleRow?: boolean

  /**
   * If true, the header is a right-angle style connector
   */
  rightAngle?: boolean

  /**
   * Orientation of the header on the PCB
   */
  pcbOrientation?: PcbOrientation

  /**
   * Diameter of the through-hole for each pin
   */
  holeDiameter?: number | string

  /**
   * Diameter of the plated area around each hole
   */
  platedDiameter?: number | string

  /**
   * Labels for each pin
   */
  pinLabels?: Record<string, SchematicPinLabel> | SchematicPinLabel[]

  /**
   * Connections to other components
   */
  connections?: Connections<string>

  /**
   * Direction the header is facing
   */
  facingDirection?: "left" | "right"

  /**
   * Pin arrangement in schematic view
   */
  schPinArrangement?: SchematicPinArrangement

  /**
   * Schematic pin style (margins, etc)
   */
  schPinStyle?: SchematicPinStyle

  /**
   * Schematic pin spacing
   */
  schPinSpacing?: number | string

  /**
   * Schematic width
   */
  schWidth?: number | string

  /**
   * Schematic height
   */
  schHeight?: number | string
}


export interface PinSideDefinition {
  pins: Array<number | string>
  direction:
    | "top-to-bottom"
    | "left-to-right"
    | "bottom-to-top"
    | "right-to-left"
}


export interface PlatformConfig {
  partsEngine?: PartsEngine

  autorouter?: AutorouterProp

  // TODO this follows a subset of the localStorage interface
  localCacheEngine?: any

  registryApiUrl?: string

  cloudAutorouterUrl?: string

  projectName?: string
  projectBaseUrl?: string
  version?: string
  url?: string
  printBoardInformationToSilkscreen?: boolean

  pcbDisabled?: boolean
  schematicDisabled?: boolean
  partsEngineDisabled?: boolean

  footprintLibraryMap?: Record<
    string,
    | ((path: string) => Promise<FootprintLibraryResult>)
    | Record<
        string,
        any[] | ((path: string) => Promise<FootprintLibraryResult>)
      >
  >
}


export interface PolygonCutoutProps
  extends Omit<PcbLayoutProps, "layer" | "pcbRotation"> {
  name?: string
  shape: "polygon"
  points: Point[]
}


export interface PolygonSmtPadProps
  extends Omit<PcbLayoutProps, "pcbRotation"> {
  name?: string
  shape: "polygon"
  points: Point[]
  portHints?: PortHints
}


export interface PotentiometerProps extends CommonComponentProps {
  maxResistance: number | string
  pinVariant?: PotentiometerPinVariant
}


export interface RectCutoutProps
  extends Omit<PcbLayoutProps, "layer" | "pcbRotation"> {
  name?: string
  shape: "rect"
  width: Distance
  height: Distance
}


export interface RectSmtPadProps extends Omit<PcbLayoutProps, "pcbRotation"> {
  name?: string
  shape: "rect"
  width: Distance
  height: Distance
  portHints?: PortHints
}


export interface RectSolderPasteProps
  extends Omit<PcbLayoutProps, "pcbRotation"> {
  shape: "rect"
  width: Distance
  height: Distance
}


export interface ResistorProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  resistance: number | string
  pullupFor?: string
  pullupTo?: string
  pulldownFor?: string
  pulldownTo?: string
  schOrientation?: SchematicOrientation
  connections?: Connections<ResistorPinLabels>
}


export interface ResonatorProps extends CommonComponentProps {
  frequency: number | string
  loadCapacitance: number | string
  pinVariant?: ResonatorPinVariant
}


export interface RotatedRectSmtPadProps
  extends Omit<PcbLayoutProps, "pcbRotation"> {
  name?: string
  shape: "rotated_rect"
  width: Distance
  height: Distance
  ccwRotation: number
  portHints?: PortHints
}


export interface SchematicCellProps {
  children?: string
  horizontalAlign?: "left" | "center" | "right"
  verticalAlign?: "top" | "middle" | "bottom"
  fontSize?: number | string
  rowSpan?: number
  colSpan?: number
  width?: number | string
  text?: string
}


export interface SchematicPortArrangementWithPinCounts {
  leftPinCount?: number
  topPinCount?: number
  rightPinCount?: number
  bottomPinCount?: number
}


export interface SchematicPortArrangementWithSides {
  leftSide?: PinSideDefinition
  topSide?: PinSideDefinition
  rightSide?: PinSideDefinition
  bottomSide?: PinSideDefinition
}


export interface SchematicPortArrangementWithSizes {
  leftSize?: number
  topSize?: number
  rightSize?: number
  bottomSize?: number
}


export interface SchematicRowProps {
  children?: any
  height?: number | string
}


export interface SchematicTableProps {
  schX?: number | string
  schY?: number | string
  children?: any
  cellPadding?: number | string
  borderWidth?: number | string
  anchor?: z.infer<typeof ninePointAnchor>
  fontSize?: number | string
}


export interface SolderJumperProps extends JumperProps {
  /**
   * Pins that are bridged with solder by default
   */
  bridgedPins?: string[][]
  /**
   * If true, all pins are connected with cuttable traces
   */
  bridged?: boolean
}


export interface StampboardProps extends BoardProps {
  leftPinCount?: number
  rightPinCount?: number
  topPinCount?: number
  bottomPinCount?: number
  leftPins?: string[]
  rightPins?: string[]
  topPins?: string[]
  bottomPins?: string[]
  pinPitch?: number | string
  innerHoles?: boolean
}


export interface SubcircuitGroupProps extends BaseGroupProps {
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

  /** Maximum length a trace can span on the schematic */
  schMaxTraceDistance?: Distance

  partsEngine?: PartsEngine

  /** When autosizing, the board will be made square */
  square?: boolean
  /** Desired empty area of the board e.g. "22mm^2" or "20%" */
  emptyArea?: string
  /** Desired filled area of the board e.g. "22mm^2" or "20%" */
  filledArea?: string

  width?: number | string
  height?: number | string
  outline?: Point[]
  outlineOffsetX?: number | string
  outlineOffsetY?: number | string
}


export interface SubcircuitGroupPropsWithBool extends SubcircuitGroupProps {
  subcircuit: true
}


export interface SupplierProps {
  supplierPartNumbers?: SupplierPartNumbers
}


export interface SwitchProps extends CommonComponentProps {
  type?: "spst" | "spdt" | "dpst" | "dpdt"
  isNormallyClosed?: boolean
  spdt?: boolean
  spst?: boolean
  dpst?: boolean
  dpdt?: boolean
}


export interface SymbolProps {
  /**
   * The facing direction that the symbol is designed for. If you set this to "right",
   * then it means the children were intended to represent the symbol facing right.
   * Generally, you shouldn't set this except where it can help prevent confusion
   * because you have a complex symbol. Default is "right" and this is most intuitive.
   */
  originalFacingDirection?: "up" | "down" | "left" | "right"
}


export interface TestpointProps extends CommonComponentProps {
  /**
   * The footprint variant of the testpoint either a surface pad or through-hole
   */
  footprintVariant?: "pad" | "through_hole"
  /**
   * The shape of the pad if using a pad variant
   */
  padShape?: "rect" | "circle"
  /**
   * Diameter of the copper pad (applies to both SMD pads and plated holes)
   */
  padDiameter?: number | string
  /**
   * Diameter of the hole if using a through-hole testpoint
   */
  holeDiameter?: number | string
  /**
   * Width of the pad when padShape is rect
   */
  width?: number | string
  /**
   * Height of the pad when padShape is rect
   */
  height?: number | string
}


export interface TransistorProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  type: "npn" | "pnp" | "bjt" | "jfet" | "mosfet" | "igbt"
  connections?: Connections<transistorPinsLabels>
}


export interface ViaProps extends CommonLayoutProps {
  name?: string
  fromLayer: LayerRefInput
  toLayer: LayerRefInput
  holeDiameter: number | string
  outerDiameter: number | string
  connectsTo?: string | string[]
}


export interface VoltageSourceProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  voltage?: number | string
  frequency?: number | string
  peakToPeakVoltage?: number | string
  waveShape?: WaveShape
  phase?: number | string
  dutyCycle?: number | string
  connections?: Connections<VoltageSourcePinLabels>
}

```
