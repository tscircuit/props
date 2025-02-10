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
  .extend({
    key: z.any().optional(),
    name: z.string(),
    cadModel: cadModelProp.optional(),
    children: z.any().optional(),
    symbolName: z.string().optional(),
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

## Available Component Types

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
```

### fabrication-note-path

```typescript
export const fabricationNotePathProps = pcbLayoutProps
  .omit({ pcbX: true, pcbY: true, pcbRotation: true })
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


export const autorouterConfig = z.object({
  serverUrl: z.string().optional(),
  inputFormat: z.enum(["simplified", "circuit-json"]).optional(),
  serverMode: z.enum(["job", "solve-endpoint"]).optional(),
  cache: z.custom<PcbRouteCache>((v) => true).optional(),
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
```

### inductor

```typescript
export const inductorProps = commonComponentProps.extend({
  inductance,
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
```

### led

```typescript
export const ledProps = commonComponentProps.extend({
  color: z.string().optional(),
})
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
```

### net

```typescript
export interface NetProps {
  name: string
}


export const netProps = z.object({
  name: z.string(),
})
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
```

### pcb-keepout

```typescript
export const pcbKeepoutProps = z.union([
  pcbLayoutProps.omit({ pcbRotation: true }).extend({
    shape: z.literal("circle"),
    radius: distance,
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
  schFacingDirection: z.enum(["up", "down", "left", "right"]).optional(),
  gender: z.enum(["male", "female"]).optional().default("male"),
  showSilkscreenPinLabels: z.boolean().optional(),
  doubleRow: z.boolean().optional(),
  holeDiameter: distance.optional(),
  platedDiameter: distance.optional(),
  pinLabels: z.array(z.string()).optional(),
  facingDirection: z.enum(["left", "right"]).optional(),
})
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


export const platedHoleProps = z.discriminatedUnion("shape", [
  pcbLayoutProps.omit({ pcbRotation: true, layer: true }).extend({
    name: z.string().optional(),
    shape: z.literal("circle"),
    holeDiameter: distance,
    outerDiameter: distance,
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
}


export const potentiometerProps = commonComponentProps.extend({
  maxResistance: resistance,
})
```

### power-source

```typescript
export const powerSourceProps = commonComponentProps.extend({
  voltage,
})
```

### push-button

```typescript
export interface PushButtonProps extends CommonComponentProps {
  internallyConnectedPins?: string[][]
}


export const pushButtonProps = commonComponentProps.extend({
  internallyConnectedPins: z.array(z.array(z.string())).optional(),
})
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
export const schematicBoxProps = z.object({
  schX: distance,
  schY: distance,
  width: distance,
  height: distance,
})
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

### schematic-text

```typescript
export const schematicTextProps = z.object({
  schX: distance,
  schY: distance,
  text: z.string(),
})
```

### silkscreen-circle

```typescript
export const silkscreenCircleProps = pcbLayoutProps
  .omit({ pcbRotation: true })
```

### silkscreen-line

```typescript
export const silkscreenLineProps = pcbLayoutProps
  .omit({ pcbX: true, pcbY: true, pcbRotation: true })
```

### silkscreen-path

```typescript
export const silkscreenPathProps = pcbLayoutProps
  .omit({ pcbX: true, pcbY: true, pcbRotation: true })
```

### silkscreen-rect

```typescript
export const silkscreenRectProps = pcbLayoutProps
  .omit({ pcbRotation: true })
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


export const rectSmtPadProps = pcbLayoutProps
  .omit({ pcbRotation: true })


export const rotatedRectSmtPadProps = pcbLayoutProps
  .omit({ pcbRotation: true })


export const circleSmtPadProps = pcbLayoutProps
  .omit({ pcbRotation: true })


export const pillSmtPadProps = pcbLayoutProps
  .omit({ pcbRotation: true })
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


export const circleSolderPasteProps = pcbLayoutProps
  .omit({ pcbRotation: true })
```

### switch

```typescript
export const switchProps = commonComponentProps.extend({
  ftype: z.literal("switch"),
  switchType: z.enum(["spst"]).default("spst"),
  isNormallyClosed: z.boolean().default(false),
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


export const traceProps = z.union([
  baseTraceProps.extend({
    path: z.array(portRef),
  }),
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
```

### via

```typescript
export const viaProps = commonLayoutProps.extend({
  fromLayer: layer_ref,
  toLayer: layer_ref,
  holeDiameter: distance,
  outerDiameter: distance,
})
```

