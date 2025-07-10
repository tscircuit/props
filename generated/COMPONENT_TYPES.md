# TSCircuit Component Types

## Common Types

### cadModel

```typescript
export const rotationPoint3 = z.object({
  x: z.union([z.number(), z.string()]),
  y: z.union([z.number(), z.string()]),
  z: z.union([z.number(), z.string()]),
})
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
export const cadModelBase = z.object({
  rotationOffset: z.number().or(rotationPoint3).optional(),
  positionOffset: point3.optional(),
  size: point3.optional(),
})
export interface CadModelStl extends CadModelBase {
  stlUrl: string
}
export const cadModelStl = cadModelBase.extend({
  stlUrl: z.string(),
})
export interface CadModelObj extends CadModelBase {
  objUrl: string
  mtlUrl?: string
}
export const cadModelObj = cadModelBase.extend({
  objUrl: z.string(),
  mtlUrl: z.string().optional(),
})
export interface CadModelJscad extends CadModelBase {
  jscad: Record<string, any>
}
export const cadModelJscad = cadModelBase.extend({
  jscad: z.record(z.any()),
})
```

### connectionsProp

```typescript
export const createConnectionsProp = <T extends readonly [string, ...string[]]>(
  labels: T,
) => {
  return z.record(z.enum(labels), connectionTarget)
}
```

### distance

```typescript
export type Distance = number | string

export { distance, length } from "circuit-json"
```

### footprintProp

```typescript
/**
 * This is an abbreviated definition of the soup elements that you can find here:
 * https://docs.tscircuit.com/api-reference/advanced/soup#pcb-smtpad
 */
export type FootprintSoupElements = {
  type: "pcb_smtpad" | "pcb_plated_hole"
  x: string | number
  y: string | number
  layer?: LayerRef
  holeDiameter?: string | number
  outerDiameter?: string | number
  shape?: "circle" | "rect"
  width?: string | number
  height?: string | number
  portHints?: string[]
}
```

### layout

```typescript
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
  footprint?: FootprintProp
}
export const pcbLayoutProps = z.object({
  pcbX: distance.optional(),
  pcbY: distance.optional(),
  pcbRotation: rotation.optional(),
  layer: layer_ref.optional(),
})
export const commonLayoutProps = z.object({
  pcbX: distance.optional(),
  pcbY: distance.optional(),
  pcbRotation: rotation.optional(),
  schX: distance.optional(),
  schY: distance.optional(),
  schRotation: rotation.optional(),
  layer: layer_ref.optional(),
  footprint: footprintProp.optional(),
})
export interface SupplierProps {
  supplierPartNumbers?: SupplierPartNumbers
}
export const supplierProps = z.object({
  supplierPartNumbers: z.record(supplier_name, z.array(z.string())).optional(),
})
export interface CommonComponentProps<PinLabel extends string = string>
  extends CommonLayoutProps {
  key?: any
  name: string
  pinAttributes?: Record<PinLabel, Record<string, any>>
  supplierPartNumbers?: SupplierPartNumbers
  cadModel?: CadModelProp
  children?: any
  symbolName?: string
  doNotPlace?: boolean
}
.extend({
    key: z.any().optional(),
    name: z.string(),
    cadModel: cadModelProp.optional(),
    children: z.any().optional(),
    symbolName: z.string().optional(),
    doNotPlace: z.boolean().optional(),
    pinAttributes: z
      .record(z.string(), z.record(z.string(), z.any()))
      .optional(),
  })
export const lrPolarPins = [
  "pin1",
  "left",
  "anode",
  "pos",
  "pin2",
  "right",
  "cathode",
  "neg",
] as const
```

### point

```typescript
export const point = z.object({
  x: distance,
  y: distance,
})
```

### point3

```typescript
export const point3 = z.object({
  x: distance,
  y: distance,
  z: distance,
})
```

### schematicPinDefinitions

```typescript
/**
 * @deprecated Use SchematicPortArrangementWithPinCounts instead.
 */
export interface SchematicPortArrangementWithSizes {
  leftSize?: number
  topSize?: number
  rightSize?: number
  bottomSize?: number
}
/**
 * Specifies the number of pins on each side of the schematic box component.
 */
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
export interface SchematicPortArrangement
  extends SchematicPortArrangementWithSizes,
    SchematicPortArrangementWithSides,
    SchematicPortArrangementWithPinCounts {}
export const explicitPinSideDefinition = z.object({
  pins: z.array(z.union([z.number(), z.string()])),
  direction: z.union([
    z.literal("top-to-bottom"),
    z.literal("left-to-right"),
    z.literal("bottom-to-top"),
    z.literal("right-to-left"),
  ]),
})
/**
 * @deprecated Use schematicPinArrangement instead.
 */
export const schematicPortArrangement = z.object({
  leftSize: z.number().optional().describe("@deprecated, use leftPinCount"),
  topSize: z.number().optional().describe("@deprecated, use topPinCount"),
  rightSize: z.number().optional().describe("@deprecated, use rightPinCount"),
  bottomSize: z.number().optional().describe("@deprecated, use bottomPinCount"),
  leftPinCount: z.number().optional(),
  rightPinCount: z.number().optional(),
  topPinCount: z.number().optional(),
  bottomPinCount: z.number().optional(),
  leftSide: explicitPinSideDefinition.optional(),
  rightSide: explicitPinSideDefinition.optional(),
  topSide: explicitPinSideDefinition.optional(),
  bottomSide: explicitPinSideDefinition.optional(),
})
```

### schematicPinStyle

```typescript
export type SchematicPinStyle = Record<
  string,
  {
    marginTop?: number | string
    marginRight?: number | string
    marginBottom?: number | string
    marginLeft?: number | string

    leftMargin?: number | string
    rightMargin?: number | string
    topMargin?: number | string
    bottomMargin?: number | string
  }
/** @deprecated use marginBottom */
export const schematicPinStyle = z.record(
  z.object({
    marginLeft: distance.optional(),
    marginRight: distance.optional(),
    marginTop: distance.optional(),
    marginBottom: distance.optional(),

    leftMargin: distance.optional(),
    rightMargin: distance.optional(),
    topMargin: distance.optional(),
    bottomMargin: distance.optional(),
  }),
```

## Available Component Types

### battery

```typescript
/** @deprecated use battery_capacity from circuit-json when circuit-json is updated */
export interface BatteryProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  capacity?: number | string
  schOrientation?: SchematicOrientation
}
export const batteryProps = commonComponentProps.extend({
  capacity: capacity.optional(),
  schOrientation: schematicOrientation.optional(),
})
```

### board

```typescript
export interface BoardProps extends Omit<SubcircuitGroupProps, "subcircuit"> {
  width?: number | string
  height?: number | string
  outline?: Point[]
  outlineOffsetX?: number | string
  outlineOffsetY?: number | string
  material?: "fr4" | "fr1"
}
export const boardProps = subcircuitGroupProps.extend({
  width: distance.optional(),
  height: distance.optional(),
  outline: z.array(point).optional(),
  outlineOffsetX: distance.optional(),
  outlineOffsetY: distance.optional(),
  material: z.enum(["fr4", "fr1"]).default("fr4"),
})
```

### breakout

```typescript
export interface BreakoutProps
  extends Omit<SubcircuitGroupProps, "subcircuit"> {
  padding?: Distance
  paddingLeft?: Distance
  paddingRight?: Distance
  paddingTop?: Distance
  paddingBottom?: Distance
}
export const breakoutProps = subcircuitGroupProps.extend({
  padding: distance.optional(),
  paddingLeft: distance.optional(),
  paddingRight: distance.optional(),
  paddingTop: distance.optional(),
  paddingBottom: distance.optional(),
})
```

### breakoutpoint

```typescript
export interface BreakoutPointProps
  extends Omit<PcbLayoutProps, "pcbRotation" | "layer"> {
  connection: string
}
export const breakoutPointProps = pcbLayoutProps
  .omit({ pcbRotation: true, layer: true })
  .extend({
    connection: z.string(),
  })
```

### capacitor

```typescript
export const capacitorPinLabels = [
  "pin1",
  "pin2",
  "pos",
  "neg",
  "anode",
  "cathode",
] as const
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
export const capacitorProps = commonComponentProps.extend({
  capacitance,
  maxVoltageRating: voltage.optional(),
  schShowRatings: z.boolean().optional().default(false),
  polarized: z.boolean().optional().default(false),
  decouplingFor: z.string().optional(),
  decouplingTo: z.string().optional(),
  bypassFor: z.string().optional(),
  bypassTo: z.string().optional(),
  maxDecouplingTraceLength: z.number().optional(),
  schOrientation: schematicOrientation.optional(),
  connections: createConnectionsProp(capacitorPinLabels).optional(),
})
```

### chip

```typescript
export interface PinCompatibleVariant {
  manufacturerPartNumber?: string
  supplierPartNumber?: SupplierPartNumbers
}
export interface ChipPropsSU<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  manufacturerPartNumber?: string
  pinLabels?: PinLabelsProp<string, PinLabel>
  showPinAliases?: boolean
  pcbPinLabels?: Record<string, string>
  schPinArrangement?: SchematicPortArrangement
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
/**
 * Get the connection prop type for a component
 *
 *   const pinLabels = { pin1: "VCC", pin2: "GND", pin3: "DATA" } as const
 *   export const MyChip = (props: ChipProps<typeof pinLabels>) => {
 *     // ...
 *   }
 *   const connections: ChipConnections<typeof MyChip> = {
 *     VCC: "...",
 *     GND: "...",
 *     DATA: "...",
 *   }
 *
 */
export type ChipConnections<T extends (props: ChipProps<any>) => any> = {
  [K in ChipPinLabels<T>]: string
}
export const pinCompatibleVariant = z.object({
  manufacturerPartNumber: z.string().optional(),
  supplierPartNumber: z.record(supplier_name, z.array(z.string())).optional(),
})
export const chipProps = commonComponentProps.extend({
  manufacturerPartNumber: z.string().optional(),
  pinLabels: pinLabelsProp.optional(),
  showPinAliases: z.boolean().optional(),
  pcbPinLabels: z.record(z.string(), z.string()).optional(),
  internallyConnectedPins: z.array(z.array(z.string())).optional(),
  externallyConnectedPins: z.array(z.array(z.string())).optional(),
  schPinArrangement: schematicPinArrangement.optional(),
  schPortArrangement: schematicPinArrangement.optional(),
  pinCompatibleVariants: z.array(pinCompatibleVariant).optional(),
  schPinStyle: schematicPinStyle.optional(),
  schPinSpacing: distance.optional(),
  schWidth: distance.optional(),
  schHeight: distance.optional(),
  noSchematicRepresentation: z.boolean().optional(),
  connections: connectionsProp.optional(),
})
```

### connector

```typescript
export interface ConnectorProps extends CommonComponentProps {
  manufacturerPartNumber?: string
  pinLabels?: Record<number | string, string | string[]>
  schPinStyle?: SchematicPinStyle
  schPinSpacing?: number | string
  schWidth?: number | string
  schHeight?: number | string
  schDirection?: "left" | "right"
  schPortArrangement?: SchematicPortArrangement
  internallyConnectedPins?: string[][]
  standard?: "usb_c" | "m2"
}
/**
   * Connector standard, e.g. usb_c, m2
   */
export const connectorProps = commonComponentProps.extend({
  manufacturerPartNumber: z.string().optional(),
  pinLabels: z
    .record(z.number().or(z.string()), z.string().or(z.array(z.string())))
    .optional(),
  schPinStyle: schematicPinStyle.optional(),
  schPinSpacing: distance.optional(),
  schWidth: distance.optional(),
  schHeight: distance.optional(),
  schDirection: z.enum(["left", "right"]).optional(),
  schPortArrangement: schematicPortArrangement.optional(),
  internallyConnectedPins: z.array(z.array(z.string())).optional(),
  standard: z.enum(["usb_c", "m2"]).optional(),
})
```

### constrainedlayout

```typescript
export interface ConstrainedLayoutProps {
  name?: string
  pcbOnly?: boolean
  schOnly?: boolean
}
export const constrainedLayoutProps = z.object({
  name: z.string().optional(),
  pcbOnly: z.boolean().optional(),
  schOnly: z.boolean().optional(),
})
```

### constraint

```typescript
export type PcbXDistConstraint = {
  pcb?: true
  xDist: Distance

  left: string

  right: string

  edgeToEdge?: true

  centerToCenter?: true
}
/**
   * If true, the provided distance is the distance between the centers of the
   * left and right components
   */
export type PcbYDistConstraint = {
  pcb?: true
  yDist: Distance

  top: string

  bottom: string

  edgeToEdge?: true
  centerToCenter?: true
}
/**
   * Selector for bottom component, e.g. ".U1" or ".R1", you can also specify the
   * edge or center of the component e.g. ".R1 bottomedge", ".R1 center"
   */
export type PcbSameYConstraint = {
  pcb?: true
  sameY?: true

  for: string[]
}
/**
   * Selector for components, e.g. [".U1", ".R1"], you can also specify the
   * edge or center of the component e.g. [".R1 leftedge", ".U1 center"]
   */
export type PcbSameXConstraint = {
  pcb?: true
  sameX?: true
  for: string[]
}
export const pcbXDistConstraintProps = z.object({
  pcb: z.literal(true).optional(),
  xDist: distance,
  left: z.string(),
  right: z.string(),

  edgeToEdge: z.literal(true).optional(),
  centerToCenter: z.literal(true).optional(),
})
export const pcbYDistConstraintProps = z.object({
  pcb: z.literal(true).optional(),
  yDist: distance,
  top: z.string(),
  bottom: z.string(),

  edgeToEdge: z.literal(true).optional(),
  centerToCenter: z.literal(true).optional(),
})
export const pcbSameYConstraintProps = z.object({
  pcb: z.literal(true).optional(),
  sameY: z.literal(true).optional(),
  for: z.array(z.string()),
})
export const pcbSameXConstraintProps = z.object({
  pcb: z.literal(true).optional(),
  sameX: z.literal(true).optional(),
  for: z.array(z.string()),
})
```

### crystal

```typescript
export interface CrystalProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  frequency: number | string
  loadCapacitance: number | string
  pinVariant?: PinVariant
  schOrientation?: SchematicOrientation
}
export const crystalProps = commonComponentProps.extend({
  frequency: frequency,
  loadCapacitance: capacitance,
  pinVariant: z.enum(["two_pin", "four_pin"]).optional(),
  schOrientation: schematicOrientation.optional(),
})
```

### cutout

```typescript
export interface RectCutoutProps
  extends Omit<PcbLayoutProps, "layer" | "pcbRotation"> {
  name?: string
  shape: "rect"
  width: Distance
  height: Distance
}
export const rectCutoutProps = pcbLayoutProps
  .omit({
    layer: true,
    pcbRotation: true,
  })
  .extend({
    name: z.string().optional(),
    shape: z.literal("rect"),
    width: distance,
    height: distance,
  })
export interface CircleCutoutProps
  extends Omit<PcbLayoutProps, "layer" | "pcbRotation"> {
  name?: string
  shape: "circle"
  radius: Distance
}
export const circleCutoutProps = pcbLayoutProps
  .omit({
    layer: true,
    pcbRotation: true,
  })
  .extend({
    name: z.string().optional(),
    shape: z.literal("circle"),
    radius: distance,
  })
export interface PolygonCutoutProps
  extends Omit<PcbLayoutProps, "layer" | "pcbRotation"> {
  name?: string
  shape: "polygon"
  points: Point[]
}
export const polygonCutoutProps = pcbLayoutProps
  .omit({
    layer: true,
    pcbRotation: true,
  })
  .extend({
    name: z.string().optional(),
    shape: z.literal("polygon"),
    points: z.array(point),
  })
```

### diode

```typescript
.extend({
    connections: connectionsProp.optional(),
    variant: diodeVariant.optional().default("standard"),
    standard: z.boolean().optional(),
    schottky: z.boolean().optional(),
    zener: z.boolean().optional(),
    photo: z.boolean().optional(),
    tvs: z.boolean().optional(),
    schOrientation: schematicOrientation.optional(),
  })
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
  variant?: "standard" | "schottky" | "zener" | "photo" | "tvs"
  standard?: boolean
  schottky?: boolean
  zener?: boolean
  photo?: boolean
  tvs?: boolean
  schOrientation?: SchematicOrientation
}
```

### fabrication-note-path

```typescript
export const fabricationNotePathProps = pcbLayoutProps
  .omit({ pcbX: true, pcbY: true, pcbRotation: true })
  .extend({
    route: z.array(route_hint_point),
    strokeWidth: length.optional(),
    color: z.string().optional(),
  })
```

### fabrication-note-text

```typescript
export const fabricationNoteTextProps = pcbLayoutProps.extend({
  text: z.string(),
  anchorAlignment: z
    .enum(["center", "top_left", "top_right", "bottom_left", "bottom_right"])
    .default("center"),
  font: z.enum(["tscircuit2024"]).optional(),
  fontSize: length.optional(),
  color: z.string().optional(),
})
```

### footprint

```typescript
export interface FootprintProps {
  originalLayer?: LayerRef
}
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
export const footprintProps = z.object({
  originalLayer: layer_ref.default("top").optional(),
})
```

### fuse

```typescript
export interface FuseProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  currentRating: number | string

  voltageRating?: number | string

  schShowRatings?: boolean

  schOrientation?: SchematicOrientation

  connections?: Connections<PinLabel>
}
/**
 * Schema for validating fuse props
 */
export const fuseProps = commonComponentProps.extend({
  currentRating: z.union([z.number(), z.string()]),
  voltageRating: z.union([z.number(), z.string()]).optional(),
  schShowRatings: z.boolean().optional(),
  schOrientation: schematicOrientation.optional(),
  connections: z
    .record(
      z.string(),
      z.union([
        z.string(),
        z.array(z.string()).readonly(),
        z.array(z.string()),
      ]),
    )
    .optional(),
})
```

### group

```typescript
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

  padding: length.optional(),
  paddingLeft: length.optional(),
  paddingRight: length.optional(),
  paddingTop: length.optional(),
  paddingBottom: length.optional(),
  paddingX: length.optional(),
  paddingY: length.optional(),

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
}
/**
   * Title to display above this group in the schematic view
   */
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
  traceClearance?: Distance
  groupMode?: "sequential-trace" | "subcircuit"
  local?: boolean
  algorithmFn?: (simpleRouteJson: any) => Promise<any>
  preset?:
    | "sequential-trace"
    | "subcircuit"
    | "auto"
    | "auto-local"
    | "auto-cloud"
}
export const autorouterConfig = z.object({
  serverUrl: z.string().optional(),
  inputFormat: z.enum(["simplified", "circuit-json"]).optional(),
  serverMode: z.enum(["job", "solve-endpoint"]).optional(),
  serverCacheEnabled: z.boolean().optional(),
  cache: z.custom<PcbRouteCache>((v) => true).optional(),
  traceClearance: length.optional(),
  groupMode: z.enum(["sequential-trace", "subcircuit"]).optional(),
  algorithmFn: z
    .custom<(simpleRouteJson: any) => Promise<any>>(
      (v) => typeof v === "function" || v === undefined,
    )
    .optional(),
  preset: z
    .enum([
      "sequential-trace",
      "subcircuit",
      "auto",
      "auto-local",
      "auto-cloud",
    ])
    .optional(),
  local: z.boolean().optional(),
})
export interface SubcircuitGroupProps extends BaseGroupProps {
  layout?: LayoutBuilder
  manualEdits?: ManualEditsFileInput
  routingDisabled?: boolean
  defaultTraceWidth?: Distance
  minTraceWidth?: Distance
  pcbRouteCache?: PcbRouteCache

  autorouter?: AutorouterProp

  schAutoLayoutEnabled?: boolean

  schTraceAutoLabelEnabled?: boolean

  partsEngine?: PartsEngine
}
/**
   * If true, net labels will automatically be created for complex traces
   */
export interface SubcircuitGroupPropsWithBool extends SubcircuitGroupProps {
  subcircuit: true
}
export interface NonSubcircuitGroupProps extends BaseGroupProps {
  subcircuit?: false | undefined
}
export const baseGroupProps = commonLayoutProps.extend({
  name: z.string().optional(),
  children: z.any().optional(),
  schTitle: z.string().optional(),
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
```

### hole

```typescript
export interface HoleProps extends Omit<PcbLayoutProps, "pcbRotation"> {
  name?: string
  diameter?: Distance
  radius?: Distance
}
export const holeProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    name: z.string().optional(),
    diameter: distance.optional(),
    radius: distance.optional(),
  })
```

### inductor

```typescript
export interface InductorProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  inductance: number | string
  maxCurrentRating?: number | string
  schOrientation?: SchematicOrientation
}
export const inductorProps = commonComponentProps.extend({
  inductance,
  maxCurrentRating: z.union([z.string(), z.number()]).optional(),
  schOrientation: schematicOrientation.optional(),
})
```

### jumper

```typescript
export interface JumperProps extends CommonComponentProps {
  manufacturerPartNumber?: string
  pinLabels?: Record<number | string, string | string[]>
  schPinStyle?: SchematicPinStyle
  schPinSpacing?: number | string
  schWidth?: number | string
  schHeight?: number | string
  schDirection?: "left" | "right"
  schPortArrangement?: SchematicPortArrangement
  pcbPinLabels?: Record<string, string>
  pinCount?: 2 | 3
  internallyConnectedPins?: string[][]
  connections?: Connections<string>
}
/**
   * Connections to other components
   */
export const jumperProps = commonComponentProps.extend({
  manufacturerPartNumber: z.string().optional(),
  pinLabels: z
    .record(z.number().or(z.string()), z.string().or(z.array(z.string())))
    .optional(),
  schPinStyle: schematicPinStyle.optional(),
  schPinSpacing: distance.optional(),
  schWidth: distance.optional(),
  schHeight: distance.optional(),
  schDirection: z.enum(["left", "right"]).optional(),
  schPortArrangement: schematicPortArrangement.optional(),
  pcbPinLabels: z.record(z.string(), z.string()).optional(),
  pinCount: z.union([z.literal(2), z.literal(3)]).optional(),
  internallyConnectedPins: z.array(z.array(z.string())).optional(),
  connections: z
    .custom<Connections>()
    .pipe(z.record(z.string(), connectionTarget))
    .optional(),
})
```

### led

```typescript
export const ledProps = commonComponentProps.extend({
  color: z.string().optional(),
  wavelength: z.string().optional(),
  schDisplayValue: z.string().optional(),
  schOrientation: schematicOrientation.optional(),
  connections: createConnectionsProp(lrPolarPins).optional(),
})
```

### mosfet

```typescript
export interface MosfetProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  channelType: "n" | "p"
  mosfetMode: "enhancement" | "depletion"
}
export const mosfetProps = commonComponentProps.extend({
  channelType: z.enum(["n", "p"]),
  mosfetMode: z.enum(["enhancement", "depletion"]),
})
export const mosfetPins = [
  "pin1",
  "drain",
  "pin2",
  "source",
  "pin3",
  "gate",
] as const
```

### net

```typescript
export interface NetProps {
  name: string
  connectsTo?: string | string[]
}
export const netProps = z.object({
  name: z.string(),
  connectsTo: z.string().or(z.array(z.string())).optional(),
})
```

### netalias

```typescript
/**
 * @deprecated Use NetLabelProps instead.
 */
export interface NetAliasProps {
  net?: string
  connection?: string
  schX?: number | string
  schY?: number | string
  schRotation?: number | string
  anchorSide?: "left" | "top" | "right" | "bottom"
}
/** @deprecated Use netLabelProps instead. */
export const netAliasProps = z.object({
  net: z.string().optional(),
  connection: z.string().optional(),
  schX: distance.optional(),
  schY: distance.optional(),
  schRotation: rotation.optional(),
  anchorSide: z.enum(["left", "top", "right", "bottom"]).optional(),
})
```

### netlabel

```typescript
export interface NetLabelProps {
  net?: string
  connection?: string
  connectsTo?: string | string[]
  schX?: number | string
  schY?: number | string
  schRotation?: number | string
  anchorSide?: "left" | "top" | "right" | "bottom"
}
export const netLabelProps = z.object({
  net: z.string().optional(),
  connection: z.string().optional(),
  connectsTo: z.string().or(z.array(z.string())).optional(),
  schX: distance.optional(),
  schY: distance.optional(),
  schRotation: rotation.optional(),
  anchorSide: z.enum(["left", "top", "right", "bottom"]).optional(),
})
```

### pcb-keepout

```typescript
pcbLayoutProps.omit({ pcbRotation: true }).extend({
    shape: z.literal("circle"),
    radius: distance,
  }),
pcbLayoutProps.extend({
    shape: z.literal("rect"),
    width: distance,
    height: distance,
  }),
```

### pcb-trace

```typescript
export const pcbTraceProps = z.object({
  layer: z.string().optional(),
  thickness: distance.optional(),
  route: z.array(route_hint_point),
})
```

### pin-header

```typescript
export interface PinHeaderProps extends CommonComponentProps {
  pinCount: number

  pitch?: number | string

  schFacingDirection?: "up" | "down" | "left" | "right"

  gender?: "male" | "female"

  showSilkscreenPinLabels?: boolean

  pcbPinLabels?: Record<string, string>

  doubleRow?: boolean

  holeDiameter?: number | string

  platedDiameter?: number | string

  pinLabels?: string[]

  connections?: Connections<string>

  facingDirection?: "left" | "right"

  schPinArrangement?: SchematicPinArrangement

  schPinStyle?: SchematicPinStyle

  schPinSpacing?: number | string

  schWidth?: number | string

  schHeight?: number | string
}
/**
   * Schematic height
   */
export const pinHeaderProps = commonComponentProps.extend({
  pinCount: z.number(),
  pitch: distance.optional(),
  schFacingDirection: z.enum(["up", "down", "left", "right"]).optional(),
  gender: z.enum(["male", "female"]).optional().default("male"),
  showSilkscreenPinLabels: z.boolean().optional(),
  pcbPinLabels: z.record(z.string(), z.string()).optional(),
  doubleRow: z.boolean().optional(),
  holeDiameter: distance.optional(),
  platedDiameter: distance.optional(),
  pinLabels: z.array(z.string()).optional(),
  connections: z
    .custom<Connections>()
    .pipe(z.record(z.string(), connectionTarget))
    .optional(),
  facingDirection: z.enum(["left", "right"]).optional(),
  schPinArrangement: schematicPinArrangement.optional(),
  schPinStyle: schematicPinStyle.optional(),
  schPinSpacing: distance.optional(),
  schWidth: distance.optional(),
  schHeight: distance.optional(),
})
```

### platedhole

```typescript
export interface CirclePlatedHoleProps
  extends Omit<PcbLayoutProps, "pcbRotation" | "layer"> {
  name?: string
  connectsTo?: string | string[]
  shape: "circle"
  holeDiameter: number | string
  outerDiameter: number | string
  portHints?: PortHints
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

  innerWidth?: number | string
  innerHeight?: number | string
}
/** @deprecated use holeHeight */
export interface PillPlatedHoleProps
  extends Omit<PcbLayoutProps, "pcbRotation" | "layer"> {
  name?: string
  connectsTo?: string | string[]
  shape: "pill"
  outerWidth: number | string
  outerHeight: number | string
  holeWidth: number | string
  holeHeight: number | string

  innerWidth?: number | string
  innerHeight?: number | string

  portHints?: PortHints
}
/** @deprecated use holeHeight */
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
export type PlatedHoleProps =
  | CirclePlatedHoleProps
  | OvalPlatedHoleProps
  | PillPlatedHoleProps
  | CircularHoleWithRectPlatedProps
  | PillWithRectPadPlatedHoleProps

const distanceHiddenUndefined = z
  .custom<z.input<typeof distance>>()
  .transform((a) => {
    if (a === undefined) return undefined
    return distance.parse(a)
  })
pcbLayoutProps.omit({ pcbRotation: true, layer: true }).extend({
      name: z.string().optional(),
      connectsTo: z.string().or(z.array(z.string())).optional(),
      shape: z.literal("circle"),
      holeDiameter: distance,
      outerDiameter: distance,
      portHints: portHints.optional(),
    }),
pcbLayoutProps.omit({ pcbRotation: true, layer: true }).extend({
      name: z.string().optional(),
      connectsTo: z.string().or(z.array(z.string())).optional(),
      shape: z.literal("oval"),
      outerWidth: distance,
      outerHeight: distance,
      holeWidth: distanceHiddenUndefined,
      holeHeight: distanceHiddenUndefined,
      innerWidth: distance.optional().describe("DEPRECATED use holeWidth"),
      innerHeight: distance.optional().describe("DEPRECATED use holeHeight"),
      portHints: portHints.optional(),
    }),
pcbLayoutProps.omit({ pcbRotation: true, layer: true }).extend({
      name: z.string().optional(),
      connectsTo: z.string().or(z.array(z.string())).optional(),
      shape: z.literal("pill"),
      outerWidth: distance,
      outerHeight: distance,
      holeWidth: distanceHiddenUndefined,
      holeHeight: distanceHiddenUndefined,
      innerWidth: distance.optional().describe("DEPRECATED use holeWidth"),
      innerHeight: distance.optional().describe("DEPRECATED use holeHeight"),
      portHints: portHints.optional(),
    }),
pcbLayoutProps.omit({ pcbRotation: true, layer: true }).extend({
      name: z.string().optional(),
      connectsTo: z.string().or(z.array(z.string())).optional(),
      shape: z.literal("circular_hole_with_rect_pad"),
      holeDiameter: distance,
      rectPadWidth: distance,
      rectPadHeight: distance,
      holeShape: z.literal("circle").optional(),
      padShape: z.literal("rect").optional(),
      portHints: portHints.optional(),
    }),
pcbLayoutProps.omit({ pcbRotation: true, layer: true }).extend({
      name: z.string().optional(),
      connectsTo: z.string().or(z.array(z.string())).optional(),
      shape: z.literal("pill_hole_with_rect_pad"),
      holeShape: z.literal("pill"),
      padShape: z.literal("rect"),
      holeWidth: distance,
      holeHeight: distance,
      rectPadWidth: distance,
      rectPadHeight: distance,
      portHints: portHints.optional(),
    }),
```

### port

```typescript
export const portProps = commonLayoutProps.extend({
  name: z.string(),
  pinNumber: z.number().optional(),
  aliases: z.array(z.string()).optional(),
  direction: direction,
})
```

### potentiometer

```typescript
export interface PotentiometerProps extends CommonComponentProps {
  maxResistance: number | string
  pinVariant?: PotentiometerPinVariant
}
export const potentiometerProps = commonComponentProps.extend({
  maxResistance: resistance,
  pinVariant: z.enum(["two_pin", "three_pin"]).optional(),
})
```

### power-source

```typescript
export const powerSourceProps = commonComponentProps.extend({
  voltage,
})
```

### resistor

```typescript
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
export const resistorProps = commonComponentProps.extend({
  resistance,

  pullupFor: z.string().optional(),
  pullupTo: z.string().optional(),

  pulldownFor: z.string().optional(),
  pulldownTo: z.string().optional(),

  schOrientation: schematicOrientation.optional(),

  connections: createConnectionsProp(resistorPinLabels).optional(),
})
```

### resonator

```typescript
export interface ResonatorProps extends CommonComponentProps {
  frequency: number | string
  loadCapacitance: number | string
  pinVariant?: ResonatorPinVariant
}
export const resonatorProps = commonComponentProps.extend({
  frequency: frequency,
  loadCapacitance: capacitance,
  pinVariant: z.enum(["no_ground", "ground_pin", "two_ground_pins"]).optional(),
})
```

### schematic-box

```typescript
export const schematicBoxProps = z
  .object({
    schX: distance.optional(),
    schY: distance.optional(),
    width: distance.optional(),
    height: distance.optional(),
    overlay: z.array(z.string()).optional(),

    padding: distance.optional(),
    paddingLeft: distance.optional(),
    paddingRight: distance.optional(),
    paddingTop: distance.optional(),
    paddingBottom: distance.optional(),

    title: z.string().optional(),
    titleAlignment: ninePointAnchor.default("top_left"),
    titleColor: z.string().optional(),
    titleFontSize: distance.optional(),
    titleInside: z.boolean().default(false),
    strokeStyle: z.enum(["solid", "dashed"]).default("solid"),
  })
```

### schematic-cell

```typescript
export const schematicCellProps = z.object({
  children: z.string().optional(),
  horizontalAlign: z.enum(["left", "center", "right"]).optional(),
  verticalAlign: z.enum(["top", "middle", "bottom"]).optional(),
  fontSize: distance.optional(),
  rowSpan: z.number().optional(),
  colSpan: z.number().optional(),
  width: distance.optional(),
})
export interface SchematicCellProps {
  children?: string
  horizontalAlign?: "left" | "center" | "right"
  verticalAlign?: "top" | "middle" | "bottom"
  fontSize?: number | string
  rowSpan?: number
  colSpan?: number
  width?: number | string
}
```

### schematic-line

```typescript
export const schematicLineProps = z.object({
  x1: distance,
  y1: distance,
  x2: distance,
  y2: distance,
})
```

### schematic-path

```typescript
export const schematicPathProps = z.object({
  points: z.array(point),
  isFilled: z.boolean().optional().default(false),
  fillColor: z.enum(["red", "blue"]).optional(),
})
```

### schematic-row

```typescript
export const schematicRowProps = z.object({
  children: z.any().optional(),
  height: distance.optional(),
})
export interface SchematicRowProps {
  children?: any
  height?: number | string
}
```

### schematic-table

```typescript
export const schematicTableProps = z.object({
  schX: distance.optional(),
  schY: distance.optional(),
  children: z.any().optional(),
  cellPadding: distance.optional(),
  borderWidth: distance.optional(),
  anchor: ninePointAnchor.optional(),
  fontSize: distance.optional(),
})
export interface SchematicTableProps {
  schX?: number | string
  schY?: number | string
  children?: any
  cellPadding?: number | string
  borderWidth?: number | string
  anchor?: z.infer<typeof ninePointAnchor>
  fontSize?: number | string
}
```

### schematic-text

```typescript
export const schematicTextProps = z.object({
  schX: distance.optional(),
  schY: distance.optional(),
  text: z.string(),
  fontSize: z.number().default(1),
  anchor: z
    .union([fivePointAnchor.describe("legacy"), ninePointAnchor])
    .default("center"),
  color: z.string().default("#000000"),
  schRotation: rotation.default(0),
})
```

### silkscreen-circle

```typescript
export const silkscreenCircleProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    isFilled: z.boolean().optional(),
    isOutline: z.boolean().optional(),
    strokeWidth: distance.optional(),
    radius: distance,
  })
```

### silkscreen-line

```typescript
export const silkscreenLineProps = pcbLayoutProps
  .omit({ pcbX: true, pcbY: true, pcbRotation: true })
  .extend({
    strokeWidth: distance,
    x1: distance,
    y1: distance,
    x2: distance,
    y2: distance,
  })
```

### silkscreen-path

```typescript
export const silkscreenPathProps = pcbLayoutProps
  .omit({ pcbX: true, pcbY: true, pcbRotation: true })
  .extend({
    route: z.array(route_hint_point),
    strokeWidth: length.optional(),
  })
```

### silkscreen-rect

```typescript
export const silkscreenRectProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    filled: z.boolean().default(true).optional(),
    stroke: z.enum(["dashed", "solid", "none"]).optional(),
    strokeWidth: distance.optional(),
    width: distance,
    height: distance,
  })
```

### silkscreen-text

```typescript
export const silkscreenTextProps = pcbLayoutProps.extend({
  text: z.string(),
  anchorAlignment: ninePointAnchor.default("center"),
  font: z.enum(["tscircuit2024"]).optional(),
  fontSize: length.optional(),
})
```

### smtpad

```typescript
export interface RectSmtPadProps extends Omit<PcbLayoutProps, "pcbRotation"> {
  name?: string
  shape: "rect"
  width: Distance
  height: Distance
  portHints?: PortHints
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
export interface CircleSmtPadProps extends Omit<PcbLayoutProps, "pcbRotation"> {
  name?: string
  shape: "circle"
  radius: Distance
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
export interface PolygonSmtPadProps
  extends Omit<PcbLayoutProps, "pcbRotation"> {
  name?: string
  shape: "polygon"
  points: Point[]
  portHints?: PortHints
}
export const rectSmtPadProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    name: z.string().optional(),
    shape: z.literal("rect"),
    width: distance,
    height: distance,
    portHints: portHints.optional(),
  })
export const rotatedRectSmtPadProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    name: z.string().optional(),
    shape: z.literal("rotated_rect"),
    width: distance,
    height: distance,
    ccwRotation: z.number(),
    portHints: portHints.optional(),
  })
export const circleSmtPadProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    name: z.string().optional(),
    shape: z.literal("circle"),
    radius: distance,
    portHints: portHints.optional(),
  })
export const pillSmtPadProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    name: z.string().optional(),
    shape: z.literal("pill"),
    width: distance,
    height: distance,
    radius: distance,
    portHints: portHints.optional(),
  })
export const polygonSmtPadProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    name: z.string().optional(),
    shape: z.literal("polygon"),
    points: z.array(point),
    portHints: portHints.optional(),
  })
```

### solderjumper

```typescript
export interface SolderJumperProps extends JumperProps {
  bridgedPins?: string[][]
  bridged?: boolean
}
/**
   * If true, all pins are connected with cuttable traces
   */
export const solderjumperProps = jumperProps.extend({
  bridgedPins: z.array(z.array(z.string())).optional(),
  bridged: z.boolean().optional(),
})
```

### solderpaste

```typescript
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
export const rectSolderPasteProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    shape: z.literal("rect"),
    width: distance,
    height: distance,
  })
export const circleSolderPasteProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    shape: z.literal("circle"),
    radius: distance,
  })
```

### stampboard

```typescript
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
export const stampboardProps = boardProps.extend({
  leftPinCount: z.number().optional(),
  rightPinCount: z.number().optional(),
  topPinCount: z.number().optional(),
  bottomPinCount: z.number().optional(),
  leftPins: z.array(z.string()).optional(),
  rightPins: z.array(z.string()).optional(),
  topPins: z.array(z.string()).optional(),
  bottomPins: z.array(z.string()).optional(),
  pinPitch: distance.optional(),
  innerHoles: z.boolean().optional(),
})
```

### switch

```typescript
export interface SwitchProps extends CommonComponentProps {
  type?: "spst" | "spdt" | "dpst" | "dpdt"
  isNormallyClosed?: boolean
  spdt?: boolean
  spst?: boolean
  dpst?: boolean
  dpdt?: boolean
}
.extend({
    type: z.enum(["spst", "spdt", "dpst", "dpdt"]).optional(),
    isNormallyClosed: z.boolean().optional().default(false),
    spst: z.boolean().optional(),
    spdt: z.boolean().optional(),
    dpst: z.boolean().optional(),
    dpdt: z.boolean().optional(),
  })
```

### testpoint

```typescript
export interface TestpointProps extends CommonComponentProps {
  footprintVariant?: "pad" | "through_hole"
  padShape?: "rect" | "circle"
  padDiameter?: number | string
  holeDiameter?: number | string
  width?: number | string
  height?: number | string
}
.extend({
    footprintVariant: z.enum(["pad", "through_hole"]).optional(),
    padShape: z.enum(["rect", "circle"]).optional().default("circle"),
    padDiameter: distance.optional(),
    holeDiameter: distance.optional(),
    width: distance.optional(),
    height: distance.optional(),
  })
```

### trace-hint

```typescript
export const routeHintPointProps = z.object({
  x: distance,
  y: distance,
  via: z.boolean().optional(),
  toLayer: layer_ref.optional(),
})
export const traceHintProps = z.object({
  for: z
    .string()
    .optional()
    .describe(
      "Selector for the port you're targeting, not required if you're inside a trace",
    ),
  order: z.number().optional(),
  offset: route_hint_point.or(routeHintPointProps).optional(),
  offsets: z
    .array(route_hint_point)
    .or(z.array(routeHintPointProps))
    .optional(),
  traceWidth: z.number().optional(),
})
```

### trace

```typescript
export const portRef = z.union([
  z.string(),
  z.custom<{ getPortSelector: () => string }>((v) =>
baseTraceProps.extend({
    path: z.array(portRef),
  }),
baseTraceProps.extend({
    from: portRef,
    to: portRef,
  }),
```

### transistor

```typescript
export interface TransistorProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  type: "npn" | "pnp" | "bjt" | "jfet" | "mosfet" | "igbt"
}
export const transistorProps = commonComponentProps.extend({
  type: z.enum(["npn", "pnp", "bjt", "jfet", "mosfet", "igbt"]),
})
export const transistorPins = [
  "pin1",
  "emitter",
  "pin2",
  "collector",
  "pin3",
  "base",
] as const
```

### via

```typescript
export interface ViaProps extends CommonLayoutProps {
  name?: string
  fromLayer: LayerRefInput
  toLayer: LayerRefInput
  holeDiameter: number | string
  outerDiameter: number | string
  connectsTo?: string | string[]
}
export const viaProps = commonLayoutProps.extend({
  name: z.string().optional(),
  fromLayer: layer_ref,
  toLayer: layer_ref,
  holeDiameter: distance,
  outerDiameter: distance,
  connectsTo: z.string().or(z.array(z.string())).optional(),
})
```

