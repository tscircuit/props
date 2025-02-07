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
export type CadModelProp = string | CadModelStl | CadModelObj | CadModelJscad
export const cadModelProp = z.union([
  z.string(),
  cadModelStl,
  cadModelObj,
  cadModelJscad,
])
x: z.union([z.number()
y: z.union([z.number()
z: z.union([z.number()
x: number | string; y: number | string; z: number | string 
x: number | string
    y: number | string
    z: number | string
  
x: number | string; y: number | string; z: number | string 
rotationOffset: z.number().or(rotationPoint3).optional()
positionOffset: point3.optional()
size: point3.optional()
stlUrl: string

stlUrl: z.string()
objUrl: string
  mtlUrl?: string

objUrl: z.string()
mtlUrl: z.string().optional()
jscad: Record<string
jscad: z.record(z.any())
```

### direction

```typescript
export type Direction = "up" | "down" | "left" | "right"
export type DirectionAlongEdge =
  | "top-to-bottom"
export const directionAlongEdge = z.enum([
  "top-to-bottom",
  "left-to-right",
  "bottom-to-top",
  "right-to-left",
])
```

### distance

```typescript
export type Distance = number | string
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
export const footprintProp = z.custom<Footprint>((v) => true)
here:
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
  footprint?: Footprint
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
export type SupplierName =
  | "jlcpcb"
export interface SupplierProps {
  supplierPartNumbers?: SupplierPartNumbers
}
export const supplierProps = z.object({
  supplierPartNumbers: z.record(supplier_name, z.array(z.string())).optional(),
})
export interface CommonComponentProps extends CommonLayoutProps {
  key?: any
  name: string
  supplierPartNumbers?: SupplierPartNumbers
  cadModel?: CadModelProp
  children?: any
  symbolName?: string
}
export const commonComponentProps = commonLayoutProps
  .merge(supplierProps)
export type ComponentProps = z.input<typeof componentProps>
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
export const distanceOrMultiplier = distance.or(z.enum(["2x", "3x", "4x"]))
pcbX: distance.optional()
pcbY: distance.optional()
pcbRotation: rotation.optional()
layer: layer_ref.optional()
pcbX: distance.optional()
pcbY: distance.optional()
pcbRotation: rotation.optional()
schX: distance.optional()
schY: distance.optional()
schRotation: rotation.optional()
layer: layer_ref.optional()
footprint: footprintProp.optional()
supplierPartNumbers: z.record(supplier_name
name: string
  supplierPartNumbers?: SupplierPartNumbers
  cadModel?: CadModelProp
  children?: any
  symbolName?: string

key: z.any().optional()
name: z.string()
cadModel: cadModelProp.optional()
children: z.any().optional()
symbolName: z.string().optional()
```

### point

```typescript
export const point = z.object({
  x: distance,
  y: distance,
})
export type Point = { x: number | string; y: number | string }
x: distance
y: distance
x: number | string; y: number | string 
```

### point3

```typescript
export const point3 = z.object({
  x: distance,
  y: distance,
  z: distance,
})
x: distance
y: distance
z: distance
```

### portHints

```typescript
export type PortHints = (string | number)[]
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
export type SchematicPinArrangementWithPinCounts =
  SchematicPortArrangementWithPinCounts
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
export const schematicPinArrangement = schematicPortArrangement
pins: Array<number | string>
  direction:
    | "top-to-bottom"
    | "left-to-right"
    | "bottom-to-top"
    | "right-to-left"

pins: z.array(z.union([z.number()
direction: z.union([
    z.literal("top-to-bottom")
leftSize: z.number().optional().describe("@deprecated
topSize: z.number().optional().describe("@deprecated
rightSize: z.number().optional().describe("@deprecated
bottomSize: z.number().optional().describe("@deprecated
leftPinCount: z.number().optional()
rightPinCount: z.number().optional()
topPinCount: z.number().optional()
bottomPinCount: z.number().optional()
leftSide: explicitPinSideDefinition.optional()
rightSide: explicitPinSideDefinition.optional()
topSide: explicitPinSideDefinition.optional()
bottomSide: explicitPinSideDefinition.optional()
```

### schematicPinStyle

```typescript
export type SchematicPinStyle = Record<
  string,
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
)
marginLeft: distance.optional()
marginRight: distance.optional()
marginTop: distance.optional()
marginBottom: distance.optional()
leftMargin: distance.optional()
rightMargin: distance.optional()
topMargin: distance.optional()
bottomMargin: distance.optional()
```

## Available Component Types

### battery

```typescript
/** @deprecated use battery_capacity from circuit-json when circuit-json is updated */
export interface BatteryProps extends CommonComponentProps {
  capacity?: number | string
}
export const batteryProps = commonComponentProps.extend({
  capacity: capacity.optional(),
})
export const batteryPins = lrPolarPins
capacity: capacity.optional()
```

### board

```typescript
export interface BoardProps extends Omit<SubcircuitGroupProps, "subcircuit"> {
  width?: number | string
  height?: number | string
  outline?: Point[]
  outlineOffsetX?: number | string
  outlineOffsetY?: number | string
}
export const boardProps = subcircuitGroupProps.extend({
  width: distance.optional(),
  height: distance.optional(),
  outline: z.array(point).optional(),
  outlineOffsetX: distance.optional(),
  outlineOffsetY: distance.optional(),
})
width: distance.optional()
height: distance.optional()
outline: z.array(point).optional()
outlineOffsetX: distance.optional()
outlineOffsetY: distance.optional()
```

### capacitor

```typescript
export interface CapacitorProps extends CommonComponentProps {
  capacitance: number | string
  polarized?: boolean
  decouplingFor?: string
  decouplingTo?: string
  bypassFor?: string
  bypassTo?: string
  maxDecouplingTraceLength?: number
}
export const capacitorProps = commonComponentProps.extend({
  capacitance,
  polarized: z.boolean().optional().default(false),
  decouplingFor: z.string().optional(),
  decouplingTo: z.string().optional(),
  bypassFor: z.string().optional(),
  bypassTo: z.string().optional(),
  maxDecouplingTraceLength: z.number().optional(),
})
export const capacitorPins = lrPolarPins
capacitance: number | string
  polarized?: boolean
  decouplingFor?: string
  decouplingTo?: string
  bypassFor?: string
  bypassTo?: string
  maxDecouplingTraceLength?: number

polarized: z.boolean().optional().default(false)
decouplingFor: z.string().optional()
decouplingTo: z.string().optional()
bypassFor: z.string().optional()
bypassTo: z.string().optional()
maxDecouplingTraceLength: z.number().optional()
```

### chip

```typescript
export interface ChipProps extends CommonComponentProps {
  manufacturerPartNumber?: string
  pinLabels?: Record<number | string, string | readonly string[]>
  schPinArrangement?: SchematicPortArrangement
  schPortArrangement?: SchematicPortArrangement
  schPinStyle?: SchematicPinStyle
  schPinSpacing?: Distance
  schWidth?: Distance
  schHeight?: Distance
  noSchematicRepresentation?: boolean
  internallyConnectedPins?: string[][]
  externallyConnectedPins?: string[][]
}
/** @deprecated Use schPinArrangement instead. */
export type PinLabels = Record<
  number | string,
export const pinLabelsProp = z.record(
  z.number().or(z.string()),
  z.string().or(z.array(z.string()).readonly()).or(z.array(z.string())),
)
export const chipProps = commonComponentProps.extend({
  manufacturerPartNumber: z.string().optional(),
  pinLabels: z
    .record(
      z.number().or(z.string()),
      z.string().or(z.array(z.string()).readonly()),
    )
    .optional(),
  internallyConnectedPins: z.array(z.array(z.string())).optional(),
  externallyConnectedPins: z.array(z.array(z.string())).optional(),
  schPinArrangement: schematicPinArrangement.optional(),
  schPortArrangement: schematicPinArrangement.optional(),
  schPinStyle: schematicPinStyle.optional(),
  schPinSpacing: distance.optional(),
  schWidth: distance.optional(),
  schHeight: distance.optional(),
  noSchematicRepresentation: z.boolean().optional(),
})
/**
 * @deprecated Use ChipProps instead.
 */
export const bugProps = chipProps
export type InferredChipProps = z.input<typeof chipProps>
manufacturerPartNumber: z.string().optional()
pinLabels: z
    .record(
      z.number().or(z.string())
internallyConnectedPins: z.array(z.array(z.string())).optional()
externallyConnectedPins: z.array(z.array(z.string())).optional()
schPinArrangement: schematicPinArrangement.optional()
schPortArrangement: schematicPinArrangement.optional()
schPinStyle: schematicPinStyle.optional()
schPinSpacing: distance.optional()
schWidth: distance.optional()
schHeight: distance.optional()
noSchematicRepresentation: z.boolean().optional()
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
name: z.string().optional()
pcbOnly: z.boolean().optional()
schOnly: z.boolean().optional()
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
/**
   * Selector for components, e.g. [".U1", ".R1"], you can also specify the
   * edge or center of the component e.g. [".R1 leftedge", ".U1 center"]
   */
export type ConstraintProps =
  | PcbXDistConstraint
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
export const constraintProps = z.union([
  pcbXDistConstraintProps,
  pcbYDistConstraintProps,
  pcbSameYConstraintProps,
  pcbSameXConstraintProps,
])
xDist: Distance

  /**
   * Selector for left component
left: string

  /**
   * Selector for right component
right: string

  /**
   * If true
yDist: Distance

  /**
   * Selector for top component
top: string

  /**
   * Selector for bottom component
bottom: string

  edgeToEdge?: true
  centerToCenter?: true

for: string[]

for: string[]

pcb: z.literal(true).optional()
xDist: distance
left: z.string()
right: z.string()
edgeToEdge: z.literal(true).optional()
centerToCenter: z.literal(true).optional()
pcb: z.literal(true).optional()
yDist: distance
top: z.string()
bottom: z.string()
edgeToEdge: z.literal(true).optional()
centerToCenter: z.literal(true).optional()
pcb: z.literal(true).optional()
sameY: z.literal(true).optional()
for: z.array(z.string())
pcb: z.literal(true).optional()
sameX: z.literal(true).optional()
for: z.array(z.string())
```

### crystal

```typescript
export type PinVariant = "2pin" | "4pin"
export interface CrystalProps extends CommonComponentProps {
  frequency: number | string
  loadCapacitance: number | string
  pinVariant?: PinVariant
}
export const crystalProps = commonComponentProps.extend({
  frequency: frequency,
  loadCapacitance: capacitance,
  pinVariant: z.enum(["2pin", "4pin"]).optional(),
})
export const crystalPins = lrPins
frequency: number | string
  loadCapacitance: number | string
  pinVariant?: PinVariant

frequency: frequency
loadCapacitance: capacitance
pinVariant: z.enum(["2pin"
```

### diode

```typescript
export type DiodeProps = z.input<typeof diodeProps>
```

### fabrication-note-path

```typescript
export const fabricationNotePathProps = pcbLayoutProps
  .omit({ pcbX: true, pcbY: true, pcbRotation: true })
export type FabricationNotePathProps = z.input<typeof fabricationNotePathProps>
pcbX: true
pcbY: true
pcbRotation: true 
route: z.array(route_hint_point)
strokeWidth: length.optional()
color: z.string().optional()
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
export type FabricationNoteTextProps = z.input<typeof fabricationNoteTextProps>
text: z.string()
anchorAlignment: z
    .enum(["center"
font: z.enum(["tscircuit2024"]).optional()
fontSize: length.optional()
color: z.string().optional()
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
originalLayer: layer_ref.default("top").optional()
```

### group

```typescript
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
  cache?: PcbRouteCache
}
export type AutorouterProp =
  | AutorouterConfig
export const autorouterConfig = z.object({
  serverUrl: z.string().optional(),
  inputFormat: z.enum(["simplified", "circuit-json"]).optional(),
  serverMode: z.enum(["job", "solve-endpoint"]).optional(),
  cache: z.custom<PcbRouteCache>((v) => true).optional(),
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
export type GroupProps = SubcircuitGroupPropsWithBool | NonSubcircuitGroupProps
export const baseGroupProps = commonLayoutProps.extend({
  name: z.string().optional(),
  children: z.any().optional(),
  key: z.any().optional(),
})
export const subcircuitGroupProps = baseGroupProps.extend({
  layout: z.custom<LayoutBuilder>((v) => true).optional(),
  manualEdits: manual_edits_file.optional(),
  schAutoLayoutEnabled: z.boolean().optional(),
  schTraceAutoLabelEnabled: z.boolean().optional(),
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
findPart: (params: {
    sourceComponent: AnySourceComponent
    footprinterString?: string
  
pcbTraces: PcbTrace[]
  cacheKey: string

serverUrl: z.string().optional()
inputFormat: z.enum(["simplified"
serverMode: z.enum(["job"
cache: z.custom<PcbRouteCache>((v) => true).optional()
subcircuit: true

name: z.string().optional()
children: z.any().optional()
key: z.any().optional()
layout: z.custom<LayoutBuilder>((v) => true).optional()
manualEdits: manual_edits_file.optional()
schAutoLayoutEnabled: z.boolean().optional()
schTraceAutoLabelEnabled: z.boolean().optional()
routingDisabled: z.boolean().optional()
defaultTraceWidth: length.optional()
minTraceWidth: length.optional()
partsEngine: z.custom<PartsEngine>((v) => "findPart" in v).optional()
pcbRouteCache: z.custom<PcbRouteCache>((v) => true).optional()
autorouter: autorouterProp.optional()
subcircuit: z.literal(true)
subcircuit: z.literal(false).optional() 
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
pcbRotation: true 
name: z.string().optional()
diameter: distance.optional()
radius: distance.optional()
diameter: d.diameter ?? 2 * d.radius!
radius: d.radius ?? d.diameter! / 2
```

### inductor

```typescript
export const inductorProps = commonComponentProps.extend({
  inductance,
})
export type InductorProps = z.input<typeof inductorProps>
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
}
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
})
manufacturerPartNumber: z.string().optional()
pinLabels: z
    .record(z.number().or(z.string())
schPinStyle: schematicPinStyle.optional()
schPinSpacing: distance.optional()
schWidth: distance.optional()
schHeight: distance.optional()
schDirection: z.enum(["left"
schPortArrangement: schematicPortArrangement.optional()
```

### led

```typescript
export const ledProps = commonComponentProps.extend({
  color: z.string().optional(),
})
export type LedProps = z.input<typeof ledProps>
color: z.string().optional()
```

### mosfet

```typescript
export interface MosfetProps extends CommonComponentProps {
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
channelType: "n" | "p"
  mosfetMode: "enhancement" | "depletion"

channelType: z.enum(["n"
mosfetMode: z.enum(["enhancement"
```

### net

```typescript
export interface NetProps {
  name: string
}
export const netProps = z.object({
  name: z.string(),
})
name: string

name: z.string()
```

### netalias

```typescript
export interface NetAliasProps {
  net?: string
  schX?: number | string
  schY?: number | string
  schRotation?: number | string
  anchorSide?: "left" | "up" | "right" | "down"
}
export const netAliasProps = z.object({
  net: z.string().optional(),
  schX: distance.optional(),
  schY: distance.optional(),
  schRotation: rotation.optional(),
  anchorSide: z.enum(["left", "up", "right", "down"]).optional(),
})
net: z.string().optional()
schX: distance.optional()
schY: distance.optional()
schRotation: rotation.optional()
anchorSide: z.enum(["left"
```

### pcb-keepout

```typescript
export const pcbKeepoutProps = z.union([
  pcbLayoutProps.omit({ pcbRotation: true }).extend({
    shape: z.literal("circle"),
    radius: distance,
  }),
  pcbLayoutProps.extend({
    shape: z.literal("rect"),
    width: distance,
    height: distance,
  }),
])
export type PcbKeepoutProps = z.input<typeof pcbKeepoutProps>
pcbRotation: true 
shape: z.literal("circle")
radius: distance
shape: z.literal("rect")
width: distance
height: distance
```

### pcb-trace

```typescript
export const pcbTraceProps = z.object({
  layer: z.string().optional(),
  thickness: distance.optional(),
  route: z.array(route_hint_point),
})
export type PcbTraceProps = z.input<typeof pcbTraceProps>
layer: z.string().optional()
thickness: distance.optional()
route: z.array(route_hint_point)
```

### pin-header

```typescript
export interface PinHeaderProps extends CommonComponentProps {
  pinCount: number

  pitch?: number | string

  gender?: "male" | "female"

  showSilkscreenPinLabels?: boolean

  doubleRow?: boolean

  holeDiameter?: number | string

  platedDiameter?: number | string

  pinLabels?: string[]

  facingDirection?: "left" | "right"
}
/**
   * Direction the header is facing
   */
export const pinHeaderProps = commonComponentProps.extend({
  pinCount: z.number(),
  pitch: distance.optional(),
  gender: z.enum(["male", "female"]).optional().default("male"),
  showSilkscreenPinLabels: z.boolean().optional(),
  doubleRow: z.boolean().optional(),
  holeDiameter: distance.optional(),
  platedDiameter: distance.optional(),
  pinLabels: z.array(z.string()).optional(),
  facingDirection: z.enum(["left", "right"]).optional(),
})
pinCount: number

  /**
   * Distance between pins
   */
  pitch?: number | string

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

pinCount: z.number()
pitch: distance.optional()
gender: z.enum(["male"
showSilkscreenPinLabels: z.boolean().optional()
doubleRow: z.boolean().optional()
holeDiameter: distance.optional()
platedDiameter: distance.optional()
pinLabels: z.array(z.string()).optional()
facingDirection: z.enum(["left"
```

### platedhole

```typescript
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
  innerWidth: number | string
  innerHeight: number | string
  portHints?: PortHints
}
export interface PillPlatedHoleProps
  extends Omit<PcbLayoutProps, "pcbRotation" | "layer"> {
  name?: string
  shape: "pill"
  outerWidth: number | string
  outerHeight: number | string
  innerWidth: number | string
  innerHeight: number | string
  portHints?: PortHints
}
export type PlatedHoleProps =
  | CirclePlatedHoleProps
export const platedHoleProps = z.discriminatedUnion("shape", [
  pcbLayoutProps.omit({ pcbRotation: true, layer: true }).extend({
    name: z.string().optional(),
    shape: z.literal("circle"),
    holeDiameter: distance,
    outerDiameter: distance,
    portHints: portHints.optional(),
  }),
  pcbLayoutProps.omit({ pcbRotation: true, layer: true }).extend({
    name: z.string().optional(),
    shape: z.literal("oval"),
    outerWidth: distance,
    outerHeight: distance,
    innerWidth: distance,
    innerHeight: distance,
    portHints: portHints.optional(),
  }),
  pcbLayoutProps.omit({ pcbRotation: true, layer: true }).extend({
    name: z.string().optional(),
    shape: z.literal("pill"),
    outerWidth: distance,
    outerHeight: distance,
    innerWidth: distance,
    innerHeight: distance,
    portHints: portHints.optional(),
  }),
])
shape: "circle"
  holeDiameter: number | string
  outerDiameter: number | string
  portHints?: PortHints

shape: "oval"
  outerWidth: number | string
  outerHeight: number | string
  innerWidth: number | string
  innerHeight: number | string
  portHints?: PortHints

shape: "pill"
  outerWidth: number | string
  outerHeight: number | string
  innerWidth: number | string
  innerHeight: number | string
  portHints?: PortHints

pcbRotation: true
layer: true 
name: z.string().optional()
shape: z.literal("circle")
holeDiameter: distance
outerDiameter: distance
portHints: portHints.optional()
pcbRotation: true
layer: true 
name: z.string().optional()
shape: z.literal("oval")
outerWidth: distance
outerHeight: distance
innerWidth: distance
innerHeight: distance
portHints: portHints.optional()
pcbRotation: true
layer: true 
name: z.string().optional()
shape: z.literal("pill")
outerWidth: distance
outerHeight: distance
innerWidth: distance
innerHeight: distance
portHints: portHints.optional()
```

### port

```typescript
export const portProps = commonLayoutProps.extend({
  name: z.string(),
  pinNumber: z.number().optional(),
  aliases: z.array(z.string()).optional(),
  direction: direction,
})
export type PortProps = z.input<typeof portProps>
name: z.string()
pinNumber: z.number().optional()
aliases: z.array(z.string()).optional()
direction: direction
```

### potentiometer

```typescript
export interface PotentiometerProps extends CommonComponentProps {
  maxResistance: number | string
}
export const potentiometerProps = commonComponentProps.extend({
  maxResistance: resistance,
})
export const potentiometerPins = lrPins
maxResistance: number | string

maxResistance: resistance
```

### power-source

```typescript
export const powerSourceProps = commonComponentProps.extend({
  voltage,
})
export type PowerSourceProps = z.input<typeof powerSourceProps>
```

### push-button

```typescript
export interface PushButtonProps extends CommonComponentProps {
  internallyConnectedPins?: string[][]
}
export const pushButtonProps = commonComponentProps.extend({
  internallyConnectedPins: z.array(z.array(z.string())).optional(),
})
internallyConnectedPins: z.array(z.array(z.string())).optional()
```

### resistor

```typescript
export interface ResistorProps extends CommonComponentProps {
  resistance: number | string
  pullupFor?: string
  pullupTo?: string
  pulldownFor?: string
  pulldownTo?: string
}
export const resistorProps = commonComponentProps.extend({
  resistance,

  pullupFor: z.string().optional(),
  pullupTo: z.string().optional(),

  pulldownFor: z.string().optional(),
  pulldownTo: z.string().optional(),
})
export const resistorPins = lrPins
resistance: number | string
  pullupFor?: string
  pullupTo?: string
  pulldownFor?: string
  pulldownTo?: string

pullupFor: z.string().optional()
pullupTo: z.string().optional()
pulldownFor: z.string().optional()
pulldownTo: z.string().optional()
```

### resonator

```typescript
export type ResonatorPinVariant = "no_ground" | "ground_pin" | "two_ground_pins"
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
frequency: number | string
  loadCapacitance: number | string
  pinVariant?: ResonatorPinVariant

frequency: frequency
loadCapacitance: capacitance
pinVariant: z.enum(["no_ground"
```

### schematic-box

```typescript
export const schematicBoxProps = z.object({
  schX: distance,
  schY: distance,
  width: distance,
  height: distance,
})
export type SchematicBoxProps = z.input<typeof schematicBoxProps>
schX: distance
schY: distance
width: distance
height: distance
```

### schematic-line

```typescript
export const schematicLineProps = z.object({
  x1: distance,
  y1: distance,
  x2: distance,
  y2: distance,
})
export type SchematicLineProps = z.input<typeof schematicLineProps>
x1: distance
y1: distance
x2: distance
y2: distance
```

### schematic-path

```typescript
export const schematicPathProps = z.object({
  points: z.array(point),
  isFilled: z.boolean().optional().default(false),
  fillColor: z.enum(["red", "blue"]).optional(),
})
export type SchematicPathProps = z.input<typeof schematicPathProps>
points: z.array(point)
isFilled: z.boolean().optional().default(false)
fillColor: z.enum(["red"
```

### schematic-text

```typescript
export const schematicTextProps = z.object({
  schX: distance,
  schY: distance,
  text: z.string(),
})
export type SchematicTextProps = z.input<typeof schematicTextProps>
schX: distance
schY: distance
text: z.string()
```

### silkscreen-circle

```typescript
export const silkscreenCircleProps = pcbLayoutProps
  .omit({ pcbRotation: true })
export type SilkscreenCircleProps = z.input<typeof silkscreenCircleProps>
pcbRotation: true 
isFilled: z.boolean().optional()
isOutline: z.boolean().optional()
strokeWidth: distance.optional()
radius: distance
```

### silkscreen-line

```typescript
export const silkscreenLineProps = pcbLayoutProps
  .omit({ pcbX: true, pcbY: true, pcbRotation: true })
export type SilkscreenLineProps = z.input<typeof silkscreenLineProps>
pcbX: true
pcbY: true
pcbRotation: true 
strokeWidth: distance
x1: distance
y1: distance
x2: distance
y2: distance
```

### silkscreen-path

```typescript
export const silkscreenPathProps = pcbLayoutProps
  .omit({ pcbX: true, pcbY: true, pcbRotation: true })
export type SilkscreenPathProps = z.input<typeof silkscreenPathProps>
pcbX: true
pcbY: true
pcbRotation: true 
route: z.array(route_hint_point)
strokeWidth: length.optional()
```

### silkscreen-rect

```typescript
export const silkscreenRectProps = pcbLayoutProps
  .omit({ pcbRotation: true })
export type SilkscreenRectProps = z.input<typeof silkscreenRectProps>
pcbRotation: true 
isFilled: z.boolean().optional()
isOutline: z.boolean().optional()
strokeWidth: distance.optional()
width: distance
height: distance
```

### silkscreen-text

```typescript
export const silkscreenTextProps = pcbLayoutProps.extend({
  text: z.string(),
  anchorAlignment: z
    .enum(["center", "top_left", "top_right", "bottom_left", "bottom_right"])
    .default("center"),
  font: z.enum(["tscircuit2024"]).optional(),
  fontSize: length.optional(),
})
export type SilkscreenTextProps = z.input<typeof silkscreenTextProps>
text: z.string()
anchorAlignment: z
    .enum(["center"
font: z.enum(["tscircuit2024"]).optional()
fontSize: length.optional()
```

### smtpad

```typescript
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
export type SmtPadProps =
  | RectSmtPadProps
export const rectSmtPadProps = pcbLayoutProps
  .omit({ pcbRotation: true })
export const rotatedRectSmtPadProps = pcbLayoutProps
  .omit({ pcbRotation: true })
export const circleSmtPadProps = pcbLayoutProps
  .omit({ pcbRotation: true })
export const pillSmtPadProps = pcbLayoutProps
  .omit({ pcbRotation: true })
export const smtPadProps = z.union([
  circleSmtPadProps,
  rectSmtPadProps,
  rotatedRectSmtPadProps,
  pillSmtPadProps,
])
shape: "rect"
  width: Distance
  height: Distance
  portHints?: PortHints

shape: "rotated_rect"
  width: Distance
  height: Distance
  ccwRotation: number
  portHints?: PortHints

shape: "circle"
  radius: Distance
  portHints?: PortHints

shape: "pill"
  width: Distance
  height: Distance
  radius: Distance
  portHints?: PortHints

pcbRotation: true 
shape: z.literal("rect")
width: distance
height: distance
portHints: portHints.optional()
pcbRotation: true 
shape: z.literal("rotated_rect")
width: distance
height: distance
ccwRotation: z.number()
portHints: portHints.optional()
pcbRotation: true 
shape: z.literal("circle")
radius: distance
portHints: portHints.optional()
pcbRotation: true 
shape: z.literal("pill")
width: distance
height: distance
radius: distance
portHints: portHints.optional()
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
export type SolderPasteProps = RectSolderPasteProps | CircleSolderPasteProps
export const rectSolderPasteProps = pcbLayoutProps
  .omit({ pcbRotation: true })
export const circleSolderPasteProps = pcbLayoutProps
  .omit({ pcbRotation: true })
export const solderPasteProps = z.union([
  circleSolderPasteProps,
  rectSolderPasteProps,
])
shape: "rect"
  width: Distance
  height: Distance

shape: "circle"
  radius: Distance

pcbRotation: true 
shape: z.literal("rect")
width: distance
height: distance
pcbRotation: true 
shape: z.literal("circle")
radius: distance
```

### subcircuit

```typescript
export type SubcircuitProps = SubcircuitGroupProps
export const subcircuitProps = subcircuitGroupProps
```

### switch

```typescript
export const switchProps = commonComponentProps.extend({
  ftype: z.literal("switch"),
  switchType: z.enum(["spst"]).default("spst"),
  isNormallyClosed: z.boolean().default(false),
})
export type SwitchProps = z.input<typeof switchProps>
ftype: z.literal("switch")
switchType: z.enum(["spst"]).default("spst")
isNormallyClosed: z.boolean().default(false)
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
export type TraceHintProps = z.input<typeof traceHintProps>
x: distance
y: distance
via: z.boolean().optional()
toLayer: layer_ref.optional()
for: z
    .string()
    .optional()
    .describe(
      "Selector for the port you're targeting
order: z.number().optional()
offset: route_hint_point.or(routeHintPointProps).optional()
offsets: z
    .array(route_hint_point)
    .or(z.array(routeHintPointProps))
    .optional()
traceWidth: z.number().optional()
```

### trace

```typescript
export const portRef = z.union([
  z.string(),
  z.custom<{ getPortSelector: () => string }>((v) =>
    Boolean(v.getPortSelector),
  ),
])
export const traceProps = z.union([
  baseTraceProps.extend({
    path: z.array(portRef),
  }),
  baseTraceProps.extend({
    from: portRef,
    to: portRef,
  }),
])
export type TraceProps = z.input<typeof traceProps>
getPortSelector: () => string 
key: z.string().optional()
thickness: distance.optional()
schematicRouteHints: z.array(point).optional()
pcbRouteHints: z.array(route_hint_point).optional()
schDisplayLabel: z.string().optional()
maxLength: distance.optional()
path: z.array(portRef)
from: portRef
to: portRef
```

### transistor

```typescript
export interface TransistorProps extends CommonComponentProps {
  type: "npn" | "pnp" | "bjt" | "jfet" | "mosfet"
}
export const transistorProps = commonComponentProps.extend({
  type: z.enum(["npn", "pnp", "bjt", "jfet", "mosfet"]),
})
export const transistorPins = [
  "pin1",
  "emitter",
  "pin2",
  "collector",
  "pin3",
  "base",
] as const
type: "npn" | "pnp" | "bjt" | "jfet" | "mosfet"

type: z.enum(["npn"
```

### via

```typescript
export const viaProps = commonLayoutProps.extend({
  fromLayer: layer_ref,
  toLayer: layer_ref,
  holeDiameter: distance,
  outerDiameter: distance,
})
export type ViaProps = z.input<typeof viaProps>
fromLayer: layer_ref
toLayer: layer_ref
holeDiameter: distance
outerDiameter: distance
```

