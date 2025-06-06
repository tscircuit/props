# @tscircuit/props Overview

> Generated at 2025-06-06T17:08:15.013Z
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
}


export interface CadModelStl extends CadModelBase {
  stlUrl: string
}


export interface CadModelObj extends CadModelBase {
  objUrl: string
  mtlUrl?: string
}


export interface CadModelJscad extends CadModelBase {
  jscad: Record<string, any>
}


export interface PcbLayoutProps {
  pcbX?: string | number
  pcbY?: string | number
  pcbRotation?: string | number
  layer?: LayerRefInput
}


export interface CommonLayoutProps {
  pcbX?: string | number
  pcbY?: string | number
  pcbRotation?: string | number

  schX?: string | number
  schY?: string | number
  schRotation?: string | number

  layer?: LayerRefInput
  footprint?: Footprint
}


export interface SupplierProps {
  supplierPartNumbers?: SupplierPartNumbers
}


export interface CommonComponentProps extends CommonLayoutProps {
  key?: any
  name: string
  supplierPartNumbers?: SupplierPartNumbers
  cadModel?: CadModelProp
  children?: any
  symbolName?: string
  doNotPlace?: boolean
}


export interface SchematicPortArrangementWithSizes {
  leftSize?: number
  topSize?: number
  rightSize?: number
  bottomSize?: number
}


export interface SchematicPortArrangementWithPinCounts {
  leftPinCount?: number
  topPinCount?: number
  rightPinCount?: number
  bottomPinCount?: number
}


export interface PinSideDefinition {
  pins: Array<number | string>
  direction:
    | "top-to-bottom"
    | "left-to-right"
    | "bottom-to-top"
    | "right-to-left"
}


export interface SchematicPortArrangementWithSides {
  leftSide?: PinSideDefinition
  topSide?: PinSideDefinition
  rightSide?: PinSideDefinition
  bottomSide?: PinSideDefinition
}


export interface BatteryProps extends CommonComponentProps {
  capacity?: number | string
}


export interface BoardProps extends Omit<SubcircuitGroupProps, "subcircuit"> {
  width?: number | string
  height?: number | string
  outline?: Point[]
  outlineOffsetX?: number | string
  outlineOffsetY?: number | string
  material?: "fr4" | "fr1"
}


export interface CapacitorProps extends CommonComponentProps {
  capacitance: number | string
  maxVoltageRating?: number | string
  schShowRatings?: boolean
  polarized?: boolean
  decouplingFor?: string
  decouplingTo?: string
  bypassFor?: string
  bypassTo?: string
  maxDecouplingTraceLength?: number
  connections?: Connections<CapacitorPinLabels>
}


export interface PinCompatibleVariant {
  manufacturerPartNumber?: string
  supplierPartNumber?: SupplierPartNumbers
}


export interface ChipPropsSU<PinLabel extends string = string>
  extends CommonComponentProps {
  manufacturerPartNumber?: string
  pinLabels?: PinLabelsProp<string, PinLabel>
  schPinArrangement?: SchematicPortArrangement
  /** @deprecated Use schPinArrangement instead. */
  schPortArrangement?: SchematicPortArrangement
  pinCompatibleVariants?: PinCompatibleVariant[]
  schPinStyle?: SchematicPinStyle
  schPinSpacing?: Distance
  schWidth?: Distance
  schHeight?: Distance
  noSchematicRepresentation?: boolean
  internallyConnectedPins?: string[][]
  externallyConnectedPins?: string[][]
  connections?: Connections<PinLabel>
}


export interface ConnectorProps extends CommonComponentProps {
  manufacturerPartNumber?: string
  pinLabels?: Record<number | string, string | string[]>
  schPinStyle?: SchematicPinStyle
  schPinSpacing?: number | string
  schWidth?: number | string
  schHeight?: number | string
  schDirection?: "left" | "right"
  schPortArrangement?: SchematicPortArrangement
  /**
   * Groups of pins that are internally connected (bridged)
   * e.g., [["1","2"], ["2","3"]]
   */
  internallyConnectedPins?: string[][]
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


export interface CrystalProps extends CommonComponentProps {
  frequency: number | string
  loadCapacitance: number | string
  pinVariant?: PinVariant
}


export interface RectCutoutProps
  extends Omit<PcbLayoutProps, "layer" | "pcbRotation"> {
  name?: string
  shape: "rect"
  width: Distance
  height: Distance
}


export interface CircleCutoutProps
  extends Omit<PcbLayoutProps, "layer" | "pcbRotation"> {
  name?: string
  shape: "circle"
  radius: Distance
}


export interface PolygonCutoutProps
  extends Omit<PcbLayoutProps, "layer" | "pcbRotation"> {
  name?: string
  shape: "polygon"
  points: Point[]
}


export interface DiodeProps extends CommonComponentProps {
  connections?: {
    anode?: string | string[] | readonly string[]
    cathode?: string | string[] | readonly string[]
    pin1?: string | string[] | readonly string[]
    pin2?: string | string[] | readonly string[]
    pos?: string | string[] | readonly string[]
    neg?: string | string[] | readonly string[]
  }
  variant?: "standard" | "schottky" | "zener" | "photo" | "tvs"
  standard?: boolean
  schottky?: boolean
  zener?: boolean
  photo?: boolean
  tvs?: boolean
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


export interface FuseProps extends CommonComponentProps {
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

  /**
   * Connections to other components
   */
  connections?: Connections<FusePinLabels>
}


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


export interface HoleProps extends Omit<PcbLayoutProps, "pcbRotation"> {
  name?: string
  diameter?: Distance
  radius?: Distance
}


export interface JumperProps extends CommonComponentProps {
  manufacturerPartNumber?: string
  pinLabels?: Record<number | string, string | string[]>
  schPinStyle?: SchematicPinStyle
  schPinSpacing?: number | string
  schWidth?: number | string
  schHeight?: number | string
  schDirection?: "left" | "right"
  schPortArrangement?: SchematicPortArrangement
  /**
   * Number of pins on the jumper (2 or 3)
   */
  pinCount?: 2 | 3
  /**
   * Groups of pins that are internally connected (bridged)
   * e.g., [["1","2"], ["2","3"]]
   */
  internallyConnectedPins?: string[][]
}


export interface MosfetProps extends CommonComponentProps {
  channelType: "n" | "p"
  mosfetMode: "enhancement" | "depletion"
}


export interface NetProps {
  name: string
}


export interface NetAliasProps {
  net?: string
  schX?: number | string
  schY?: number | string
  schRotation?: number | string
  anchorSide?: "left" | "up" | "right" | "down"
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
   * Whether the header is male or female
   */
  gender?: "male" | "female"

  /**
   * Whether to show pin labels in silkscreen
   */
  showSilkscreenPinLabels?: boolean

  /**
   * Whether the header has two rows of pins
   */
  doubleRow?: boolean

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
  pinLabels?: string[]

  /**
   * Direction the header is facing
   */
  facingDirection?: "left" | "right"

  /**
   * Pin arrangement in schematic view
   */
  schPinArrangement?: SchematicPinArrangement
}


export interface CirclePlatedHoleProps
  extends Omit<PcbLayoutProps, "pcbRotation" | "layer"> {
  name?: string
  shape: "circle"
  holeDiameter: number | string
  outerDiameter: number | string
  portHints?: PortHints
}


export interface OvalPlatedHoleProps
  extends Omit<PcbLayoutProps, "pcbRotation" | "layer"> {
  name?: string
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


export interface PillPlatedHoleProps
  extends Omit<PcbLayoutProps, "pcbRotation" | "layer"> {
  name?: string
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


export interface CircularHoleWithRectPlatedProps
  extends Omit<PcbLayoutProps, "pcbRotation" | "layer"> {
  name?: string
  holeDiameter: number | string
  rectPadWidth: number | string
  rectPadHeight: number | string
  holeShape?: "circle"
  padShape?: "rect"
  shape?: "circular_hole_with_rect_pad"
  portHints?: PortHints
}


export interface PillWithRectPadPlatedHoleProps
  extends Omit<PcbLayoutProps, "pcbRotation" | "layer"> {
  name?: string
  shape: "pill_hole_with_rect_pad"
  holeShape: "pill"
  padShape: "rect"
  holeWidth: number | string
  holeHeight: number | string
  rectPadWidth: number | string
  rectPadHeight: number | string
  portHints?: PortHints
}


export interface PotentiometerProps extends CommonComponentProps {
  maxResistance: number | string
  pinVariant?: PotentiometerPinVariant
}


export interface ResistorProps extends CommonComponentProps {
  resistance: number | string
  pullupFor?: string
  pullupTo?: string
  pulldownFor?: string
  pulldownTo?: string
  connections?: Connections<ResistorPinLabels>
}


export interface ResonatorProps extends CommonComponentProps {
  frequency: number | string
  loadCapacitance: number | string
  pinVariant?: ResonatorPinVariant
}


export interface RectSmtPadProps extends Omit<PcbLayoutProps, "pcbRotation"> {
  shape: "rect"
  width: Distance
  height: Distance
  portHints?: PortHints
}


export interface RotatedRectSmtPadProps
  extends Omit<PcbLayoutProps, "pcbRotation"> {
  shape: "rotated_rect"
  width: Distance
  height: Distance
  ccwRotation: number
  portHints?: PortHints
}


export interface CircleSmtPadProps extends Omit<PcbLayoutProps, "pcbRotation"> {
  shape: "circle"
  radius: Distance
  portHints?: PortHints
}


export interface PillSmtPadProps extends Omit<PcbLayoutProps, "pcbRotation"> {
  shape: "pill"
  width: Distance
  height: Distance
  radius: Distance
  portHints?: PortHints
}


export interface PolygonSmtPadProps
  extends Omit<PcbLayoutProps, "pcbRotation"> {
  shape: "polygon"
  points: Point[]
  portHints?: PortHints
}


export interface RectSolderPasteProps
  extends Omit<PcbLayoutProps, "pcbRotation"> {
  shape: "rect"
  width: Distance
  height: Distance
}


export interface CircleSolderPasteProps
  extends Omit<PcbLayoutProps, "pcbRotation"> {
  shape: "circle"
  radius: Distance
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


export interface SwitchProps extends CommonComponentProps {
  type?: "spst" | "spdt" | "dpst" | "dpdt"
  isNormallyClosed?: boolean
  spdt?: boolean
  spst?: boolean
  dpst?: boolean
  dpdt?: boolean
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


export interface TransistorProps extends CommonComponentProps {
  type: "npn" | "pnp" | "bjt" | "jfet" | "mosfet"
}


export interface BaseManualEditEvent {
  edit_event_id: string
  in_progress?: boolean
  created_at: number
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


export interface PlatformConfig {
  partsEngine?: PartsEngine

  autorouter?: AutorouterProp

  // TODO this follows a subset of the localStorage interface
  localCacheEngine?: any

  registryApiUrl?: string

  cloudAutorouterUrl?: string

  pcbDisabled?: boolean
  schematicDisabled?: boolean
  partsEngineDisabled?: boolean

  footprintLibraryMap?: Record<
    string,
    Record<
      string,
      | any[]
      | ((path: string) => Promise<{
          footprintCircuitJson: any[]
        }>)
    >
  >
}

```
