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
  modelUnitToMmScale?: Distance
  zOffsetFromSurface?: Distance
}
export const cadModelBase = z.object({
  rotationOffset: z.number().or(rotationPoint3).optional(),
  positionOffset: point3.optional(),
  size: point3.optional(),
  modelUnitToMmScale: distance.optional(),
  zOffsetFromSurface: distance.optional(),
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
export interface CadModelGltf extends CadModelBase {
  gltfUrl: string
}
export const cadModelGltf = cadModelBase.extend({
  gltfUrl: z.string(),
})
export interface CadModelGlb extends CadModelBase {
  glbUrl: string
}
export const cadModelGlb = cadModelBase.extend({
  glbUrl: z.string(),
})
export interface CadModelStep extends CadModelBase {
  stepUrl: string
}
export const cadModelStep = cadModelBase.extend({
  stepUrl: z.string(),
})
export interface CadModelWrl extends CadModelBase {
  wrlUrl: string
}
export const cadModelWrl = cadModelBase.extend({
  wrlUrl: z.string(),
})
export interface CadModelJscad extends CadModelBase {
  jscad: Record<string, any>
}
export const cadModelJscad = cadModelBase.extend({
  jscad: z.record(z.any()),
})
export const cadModelProp = z.union([
  z.null(),
  z.string(),
  z.custom<ReactElement>((v) => {
    return v && typeof v === "object" && "type" in v && "props" in v
  }),
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
export const pcbCoordinate = calcString.or(baseDistance)

export { length }
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

### kicadFootprintMetadata

```typescript
export interface KicadAt {
  x: number | string
  y: number | string
  rotation?: number | string
}
export const kicadAt = point.extend({
  rotation: rotation.optional(),
})
export interface KicadFont {
  size?: { x: number | string; y: number | string }
  thickness?: number | string
}
export const kicadFont = z.object({
  size: point.optional(),
  thickness: distance.optional(),
})
export interface KicadEffects {
  font?: KicadFont
}
export const kicadEffects = z.object({
  font: kicadFont.optional(),
})
export interface KicadProperty {
  value: string
  at?: KicadAt
  layer?: string
  uuid?: string
  hide?: boolean
  effects?: KicadEffects
}
export const kicadProperty = z.object({
  value: z.string(),
  at: kicadAt.optional(),
  layer: z.string().optional(),
  uuid: z.string().optional(),
  hide: z.boolean().optional(),
  effects: kicadEffects.optional(),
})
export interface KicadFootprintProperties {
  Reference?: KicadProperty
  Value?: KicadProperty
  Datasheet?: KicadProperty
  Description?: KicadProperty
}
export const kicadFootprintProperties = z.object({
  Reference: kicadProperty.optional(),
  Value: kicadProperty.optional(),
  Datasheet: kicadProperty.optional(),
  Description: kicadProperty.optional(),
})
export interface KicadFootprintAttributes {
  through_hole?: boolean
  smd?: boolean
  exclude_from_pos_files?: boolean
  exclude_from_bom?: boolean
}
export const kicadFootprintAttributes = z.object({
  through_hole: z.boolean().optional(),
  smd: z.boolean().optional(),
  exclude_from_pos_files: z.boolean().optional(),
  exclude_from_bom: z.boolean().optional(),
})
export interface KicadFootprintPad {
  name: string
  type: string
  shape?: string
  at?: KicadAt
  size?: { x: number | string; y: number | string }
  drill?: number | string
  layers?: string[]
  removeUnusedLayers?: boolean
  uuid?: string
}
export const kicadFootprintPad = z.object({
  name: z.string(),
  type: z.string(),
  shape: z.string().optional(),
  at: kicadAt.optional(),
  size: point.optional(),
  drill: distance.optional(),
  layers: z.array(z.string()).optional(),
  removeUnusedLayers: z.boolean().optional(),
  uuid: z.string().optional(),
})
export interface KicadFootprintModel {
  path: string
  offset?: { x: number | string; y: number | string; z: number | string }
  scale?: { x: number | string; y: number | string; z: number | string }
  rotate?: { x: number | string; y: number | string; z: number | string }
}
export const kicadFootprintModel = z.object({
  path: z.string(),
  offset: point3.optional(),
  scale: point3.optional(),
  rotate: point3.optional(),
})
export interface KicadFootprintMetadata {
  footprintName?: string
  version?: number | string
  generator?: string
  generatorVersion?: number | string
  layer?: string
  properties?: KicadFootprintProperties
  attributes?: KicadFootprintAttributes
  pads?: KicadFootprintPad[]
  embeddedFonts?: boolean
  model?: KicadFootprintModel
}
export const kicadFootprintMetadata = z.object({
  footprintName: z.string().optional(),
  version: z.union([z.number(), z.string()]).optional(),
  generator: z.string().optional(),
  generatorVersion: z.union([z.number(), z.string()]).optional(),
  layer: z.string().optional(),
  properties: kicadFootprintProperties.optional(),
  attributes: kicadFootprintAttributes.optional(),
  pads: z.array(kicadFootprintPad).optional(),
  embeddedFonts: z.boolean().optional(),
  model: kicadFootprintModel.optional(),
})
```

### kicadPinMetadata

```typescript
export interface KicadPinMetadata {
  electricalType?: KicadPinElectricalType
  graphicStyle?: KicadPinGraphicStyle
  pinLength?: number | string
  nameTextSize?: number | string
  numberTextSize?: number | string
}
export const kicadPinMetadata = z.object({
  electricalType: kicadPinElectricalType.optional(),
  graphicStyle: kicadPinGraphicStyle.optional(),
  pinLength: z.union([z.number(), z.string()]).optional(),
  nameTextSize: z.union([z.number(), z.string()]).optional(),
  numberTextSize: z.union([z.number(), z.string()]).optional(),
})
```

### kicadSymbolMetadata

```typescript
export interface KicadSymbolPinNumbers {
  hide?: boolean
}
export const kicadSymbolPinNumbers = z.object({
  hide: z.boolean().optional(),
})
export interface KicadSymbolPinNames {
  offset?: number | string
  hide?: boolean
}
export const kicadSymbolPinNames = z.object({
  offset: distance.optional(),
  hide: z.boolean().optional(),
})
export interface KicadSymbolEffects {
  font?: KicadFont
  justify?: string | string[]
  hide?: boolean
}
export const kicadSymbolEffects = z.object({
  font: kicadFont.optional(),
  justify: z.union([z.string(), z.array(z.string())]).optional(),
  hide: z.boolean().optional(),
})
export interface KicadSymbolProperty {
  value: string
  id?: number | string
  at?: KicadAt
  effects?: KicadSymbolEffects
}
export const kicadSymbolProperty = z.object({
  value: z.string(),
  id: z.union([z.number(), z.string()]).optional(),
  at: kicadAt.optional(),
  effects: kicadSymbolEffects.optional(),
})
export interface KicadSymbolProperties {
  Reference?: KicadSymbolProperty
  Value?: KicadSymbolProperty
  Footprint?: KicadSymbolProperty
  Datasheet?: KicadSymbolProperty
  Description?: KicadSymbolProperty
  ki_keywords?: KicadSymbolProperty
  ki_fp_filters?: KicadSymbolProperty
}
export const kicadSymbolProperties = z.object({
  Reference: kicadSymbolProperty.optional(),
  Value: kicadSymbolProperty.optional(),
  Footprint: kicadSymbolProperty.optional(),
  Datasheet: kicadSymbolProperty.optional(),
  Description: kicadSymbolProperty.optional(),
  ki_keywords: kicadSymbolProperty.optional(),
  ki_fp_filters: kicadSymbolProperty.optional(),
})
export interface KicadSymbolMetadata {
  symbolName?: string
  extends?: string
  pinNumbers?: KicadSymbolPinNumbers
  pinNames?: KicadSymbolPinNames
  excludeFromSim?: boolean
  inBom?: boolean
  onBoard?: boolean
  properties?: KicadSymbolProperties
  embeddedFonts?: boolean
}
export const kicadSymbolMetadata = z.object({
  symbolName: z.string().optional(),
  extends: z.string().optional(),
  pinNumbers: kicadSymbolPinNumbers.optional(),
  pinNames: kicadSymbolPinNames.optional(),
  excludeFromSim: z.boolean().optional(),
  inBom: z.boolean().optional(),
  onBoard: z.boolean().optional(),
  properties: kicadSymbolProperties.optional(),
  embeddedFonts: z.boolean().optional(),
})
```

### layout

```typescript
export interface PcbLayoutProps {
  pcbX?: string | number
  pcbY?: string | number
  pcbLeftEdgeX?: string | number
  pcbRightEdgeX?: string | number
  pcbTopEdgeY?: string | number
  pcbBottomEdgeY?: string | number
  pcbOffsetX?: string | number
  pcbOffsetY?: string | number
  pcbRotation?: string | number
  pcbPositionAnchor?: string
  pcbPositionMode?: PcbPositionMode
  layer?: LayerRefInput
  pcbMarginTop?: string | number
  pcbMarginRight?: string | number
  pcbMarginBottom?: string | number
  pcbMarginLeft?: string | number
  pcbMarginX?: string | number
  pcbMarginY?: string | number
  pcbStyle?: PcbStyle
  pcbRelative?: boolean
  relative?: boolean
}
/**
   * If true, both pcb and schematic coordinates will be interpreted relative to the parent group
   */
export interface CommonLayoutProps {
  pcbX?: string | number
  pcbY?: string | number
  pcbLeftEdgeX?: string | number
  pcbRightEdgeX?: string | number
  pcbTopEdgeY?: string | number
  pcbBottomEdgeY?: string | number
  pcbOffsetX?: string | number
  pcbOffsetY?: string | number
  pcbRotation?: string | number
  pcbPositionAnchor?: string
  pcbPositionMode?: PcbPositionMode

  pcbMarginTop?: string | number
  pcbMarginRight?: string | number
  pcbMarginBottom?: string | number
  pcbMarginLeft?: string | number
  pcbMarginX?: string | number
  pcbMarginY?: string | number
  pcbStyle?: PcbStyle

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
  schStyle?: SchStyle

  relative?: boolean

  schRelative?: boolean

  pcbRelative?: boolean
}
/**
   * If true, pcbX/pcbY will be interpreted relative to the parent group
   */
export const pcbLayoutProps = z.object({
  pcbX: pcbCoordinate.optional(),
  pcbY: pcbCoordinate.optional(),
  pcbLeftEdgeX: pcbCoordinate.optional(),
  pcbRightEdgeX: pcbCoordinate.optional(),
  pcbTopEdgeY: pcbCoordinate.optional(),
  pcbBottomEdgeY: pcbCoordinate.optional(),
  pcbOffsetX: distance.optional(),
  pcbOffsetY: distance.optional(),
  pcbRotation: rotation.optional(),
  pcbPositionAnchor: z.string().optional(),
  pcbPositionMode: z
    .enum([
      "relative_to_group_anchor",
      "auto",
      "relative_to_board_anchor",
      "relative_to_component_anchor",
    ])
    .optional(),
  layer: layer_ref.optional(),
  pcbMarginTop: distance.optional(),
  pcbMarginRight: distance.optional(),
  pcbMarginBottom: distance.optional(),
  pcbMarginLeft: distance.optional(),
  pcbMarginX: distance.optional(),
  pcbMarginY: distance.optional(),
  pcbStyle: pcbStyle.optional(),
  pcbRelative: z.boolean().optional(),
  relative: z.boolean().optional(),
})
export const commonLayoutProps = z.object({
  pcbX: pcbCoordinate.optional(),
  pcbY: pcbCoordinate.optional(),
  pcbLeftEdgeX: pcbCoordinate.optional(),
  pcbRightEdgeX: pcbCoordinate.optional(),
  pcbTopEdgeY: pcbCoordinate.optional(),
  pcbBottomEdgeY: pcbCoordinate.optional(),
  pcbOffsetX: distance.optional(),
  pcbOffsetY: distance.optional(),
  pcbRotation: rotation.optional(),
  pcbPositionAnchor: z.string().optional(),
  pcbPositionMode: z
    .enum([
      "relative_to_group_anchor",
      "auto",
      "relative_to_board_anchor",
      "relative_to_component_anchor",
    ])
    .optional(),
  pcbMarginTop: distance.optional(),
  pcbMarginRight: distance.optional(),
  pcbMarginBottom: distance.optional(),
  pcbMarginLeft: distance.optional(),
  pcbMarginX: distance.optional(),
  pcbMarginY: distance.optional(),
  pcbStyle: pcbStyle.optional(),
  schMarginTop: distance.optional(),
  schMarginRight: distance.optional(),
  schMarginBottom: distance.optional(),
  schMarginLeft: distance.optional(),
  schMarginX: distance.optional(),
  schMarginY: distance.optional(),
  schX: distance.optional(),
  schY: distance.optional(),
  schRotation: rotation.optional(),
  layer: layer_ref.optional(),
  footprint: footprintProp.optional(),
  symbol: symbolProp.optional(),
  schStyle: schStyle.optional(),
  relative: z.boolean().optional(),
  schRelative: z.boolean().optional(),
  pcbRelative: z.boolean().optional(),
})
export interface SupplierProps {
  supplierPartNumbers?: SupplierPartNumbers
}
export const supplierProps = z.object({
  supplierPartNumbers: z.record(supplier_name, z.array(z.string())).optional(),
})
export interface PinAttributeMap {
  providesPower?: boolean
  requiresPower?: boolean
  providesGround?: boolean
  requiresGround?: boolean
  providesVoltage?: string | number
  requiresVoltage?: string | number
  doNotConnect?: boolean
  includeInBoardPinout?: boolean
  highlightColor?: string
  mustBeConnected?: boolean
}
export const pinAttributeMap = z.object({
  providesPower: z.boolean().optional(),
  requiresPower: z.boolean().optional(),
  providesGround: z.boolean().optional(),
  requiresGround: z.boolean().optional(),
  providesVoltage: z.union([z.string(), z.number()]).optional(),
  requiresVoltage: z.union([z.string(), z.number()]).optional(),
  doNotConnect: z.boolean().optional(),
  includeInBoardPinout: z.boolean().optional(),
  highlightColor: z.string().optional(),
  mustBeConnected: z.boolean().optional(),
})
export interface CommonComponentProps<PinLabel extends string = string>
  extends CommonLayoutProps {
  key?: any
  name: string
  displayName?: string
  datasheetUrl?: string
  pinAttributes?: Record<PinLabel, PinAttributeMap>
  supplierPartNumbers?: SupplierPartNumbers
  cadModel?: CadModelProp
  kicadFootprintMetadata?: KicadFootprintMetadata
  kicadSymbolMetadata?: KicadSymbolMetadata
  children?: any
  symbolName?: string
  doNotPlace?: boolean
  obstructsWithinBounds?: boolean
  showAsTranslucentModel?: boolean
  mfn?: string
  manufacturerPartNumber?: string
}
.extend({
    key: z.any().optional(),
    name: z.string(),
    displayName: z.string().optional(),
    datasheetUrl: z.string().optional(),
    cadModel: cadModelProp.optional(),
    kicadFootprintMetadata: kicadFootprintMetadata.optional(),
    kicadSymbolMetadata: kicadSymbolMetadata.optional(),
    children: z.any().optional(),
    symbolName: z.string().optional(),
    doNotPlace: z.boolean().optional(),
    obstructsWithinBounds: z
      .boolean()
      .optional()
      .describe(
        "Does this component take up all the space within its bounds on a layer. This is generally true except for when separated pin headers are being represented by a single component (in which case, chips can be placed between the pin headers) or for tall modules where chips fit underneath",
      ),
    showAsTranslucentModel: z
      .boolean()
      .optional()
      .describe(
        "Whether to show this component's CAD model as translucent in the 3D viewer.",
      ),
    pinAttributes: z.record(z.string(), pinAttributeMap).optional(),
    mfn: z.string().describe("Manufacturer Part Number").optional(),
    manufacturerPartNumber: z.string().optional(),
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

### pcbStyle

```typescript
export interface PcbStyle {
  silkscreenFontSize?: string | number
  viaPadDiameter?: string | number
  viaHoleDiameter?: string | number
  silkscreenTextPosition?:
    | "centered"
    | "outside"
    | "none"
    | {
        offsetX: number
        offsetY: number
      }
  silkscreenTextVisibility?: "hidden" | "visible" | "inherit"
}
export const pcbStyle = z.object({
  silkscreenFontSize: distance.optional(),
  viaPadDiameter: distance.optional(),
  viaHoleDiameter: distance.optional(),
  silkscreenTextPosition: z
    .union([
      z.enum(["centered", "outside", "none"]),
      z.object({
        offsetX: z.number(),
        offsetY: z.number(),
      }),
    ])
    .optional(),
  silkscreenTextVisibility: z.enum(["hidden", "visible", "inherit"]).optional(),
})
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

### schStyle

```typescript
export interface SchStyle {
  defaultPassiveSize?: "xs" | "sm" | "md" | string | number
  defaultCapacitorOrientation?: "vertical" | "none"
}
export const schStyle = z.object({
  defaultPassiveSize: z
    .union([z.enum(["xs", "sm", "md"]), distance])
    .optional(),
  defaultCapacitorOrientation: z.enum(["vertical", "none"]).optional(),
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

### analogsimulation

```typescript
export interface AnalogSimulationProps {
  simulationType?: "spice_transient_analysis"
  duration?: number | string
  timePerStep?: number | string
  spiceEngine?: AutocompleteString<"spicey" | "ngspice">
}
export const analogSimulationProps = z.object({
  simulationType: z
    .literal("spice_transient_analysis")
    .default("spice_transient_analysis"),
  duration: ms.optional(),
  timePerStep: ms.optional(),
  spiceEngine: spiceEngine.optional(),
})
```

### battery

```typescript
/** @deprecated use battery_capacity from circuit-json when circuit-json is updated */
export interface BatteryProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  capacity?: number | string
  voltage?: number | string
  standard?: "AA" | "AAA" | "9V" | "CR2032" | "18650" | "C"
  schOrientation?: SchematicOrientation
}
export const batteryProps = commonComponentProps.extend({
  capacity: capacity.optional(),
  voltage: voltage.optional(),
  standard: z.enum(["AA", "AAA", "9V", "CR2032", "18650", "C"]).optional(),
  schOrientation: schematicOrientation.optional(),
})
```

### board

```typescript
export interface BoardProps
  extends Omit<SubcircuitGroupProps, "subcircuit" | "connections"> {
  title?: string
  material?: "fr4" | "fr1"
  layers?: 1 | 2 | 4 | 6 | 8
  borderRadius?: Distance
  thickness?: Distance
  boardAnchorPosition?: Point
  anchorAlignment?: z.infer<typeof ninePointAnchor>
  boardAnchorAlignment?: z.infer<typeof ninePointAnchor>
  solderMaskColor?: BoardColor
  topSolderMaskColor?: BoardColor
  bottomSolderMaskColor?: BoardColor
  silkscreenColor?: BoardColor
  topSilkscreenColor?: BoardColor
  bottomSilkscreenColor?: BoardColor
  doubleSidedAssembly?: boolean
  schematicDisabled?: boolean
}
/** Whether this board should be omitted from the schematic view */
export const boardProps = subcircuitGroupProps
  .omit({ connections: true })
  .extend({
    material: z.enum(["fr4", "fr1"]).default("fr4"),
    layers: z
      .union([
        z.literal(1),
        z.literal(2),
        z.literal(4),
        z.literal(6),
        z.literal(8),
      ])
      .default(2),
    borderRadius: distance.optional(),
    thickness: distance.optional(),
    boardAnchorPosition: point.optional(),
    anchorAlignment: ninePointAnchor.optional(),
    boardAnchorAlignment: ninePointAnchor
      .optional()
      .describe("Prefer using anchorAlignment when possible"),
    title: z.string().optional(),
    solderMaskColor: boardColor.optional(),
    topSolderMaskColor: boardColor.optional(),
    bottomSolderMaskColor: boardColor.optional(),
    silkscreenColor: boardColor.optional(),
    topSilkscreenColor: boardColor.optional(),
    bottomSilkscreenColor: boardColor.optional(),
    doubleSidedAssembly: z.boolean().optional().default(false),
    schematicDisabled: z.boolean().optional(),
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

### cadassembly

```typescript
export interface CadAssemblyProps {
  originalLayer?: LayerRef

  children?: any
}
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
export const cadassemblyProps = z.object({
  originalLayer: layer_ref.default("top").optional(),
  children: z.any().optional(),
})
```

### cadmodel

```typescript
export interface CadModelProps extends CadModelBase {
  modelUrl: string
  stepUrl?: string
  pcbX?: Distance
  pcbY?: Distance
  pcbLeftEdgeX?: Distance
  pcbRightEdgeX?: Distance
  pcbTopEdgeY?: Distance
  pcbBottomEdgeY?: Distance
  pcbOffsetX?: Distance
  pcbOffsetY?: Distance
  pcbZ?: Distance
}
const cadModelBaseWithUrl = cadModelBase.extend({
  modelUrl: z.string(),
  stepUrl: z.string().optional(),
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
  schSize?: SchematicSymbolSize
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
  schSize: schematicSymbolSize.optional(),
  connections: createConnectionsProp(capacitorPinLabels).optional(),
})
```

### chip

```typescript
export interface PinCompatibleVariant {
  manufacturerPartNumber?: string
  supplierPartNumber?: SupplierPartNumbers
}
export interface ChipPropsSU<
  PinLabel extends SchematicPinLabel = SchematicPinLabel,
> extends CommonComponentProps<PinLabel> {
  manufacturerPartNumber?: string
  pinLabels?: PinLabelsProp<SchematicPinLabel, PinLabel>
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
  internallyConnectedPins?: (string | number)[][]
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
  internallyConnectedPins: z
    .array(z.array(z.union([z.string(), z.number()])))
    .optional(),
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
  internallyConnectedPins?: (string | number)[][]
  standard?: "usb_c" | "m2"
}
/**
   * Connector standard, e.g. usb_c, m2
   */
export const connectorProps = commonComponentProps.extend({
  manufacturerPartNumber: z.string().optional(),
  pinLabels: z
    .record(
      z.number().or(schematicPinLabel),
      schematicPinLabel.or(z.array(schematicPinLabel)),
    )
    .optional(),
  schPinStyle: schematicPinStyle.optional(),
  schPinSpacing: distance.optional(),
  schWidth: distance.optional(),
  schHeight: distance.optional(),
  schDirection: z.enum(["left", "right"]).optional(),
  schPortArrangement: schematicPortArrangement.optional(),
  internallyConnectedPins: z
    .array(z.array(z.union([z.string(), z.number()])))
    .optional(),
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

### copper-pour

```typescript
export interface CopperPourProps {
  name?: string
  layer: LayerRefInput
  connectsTo: string
  padMargin?: Distance
  traceMargin?: Distance
  clearance?: Distance
  boardEdgeMargin?: Distance
  cutoutMargin?: Distance
  outline?: Point[]
  coveredWithSolderMask?: boolean
}
export const copperPourProps = z.object({
  name: z.string().optional(),
  layer: layer_ref,
  connectsTo: z.string(),
  padMargin: distance.optional(),
  traceMargin: distance.optional(),
  clearance: distance.optional(),
  boardEdgeMargin: distance.optional(),
  cutoutMargin: distance.optional(),
  outline: z.array(point).optional(),
  coveredWithSolderMask: z.boolean().optional().default(true),
})
```

### copper-text

```typescript
export const copperTextProps = pcbLayoutProps.extend({
  text: z.string(),
  anchorAlignment: ninePointAnchor.default("center"),
  font: z.enum(["tscircuit2024"]).optional(),
  fontSize: length.optional(),
  layers: z.array(layer_ref).optional(),
  knockout: z.boolean().optional(),
  mirrored: z.boolean().optional(),
})
```

### courtyard-outline

```typescript
export const courtyardOutlineProps = pcbLayoutProps
  .omit({
    pcbLeftEdgeX: true,
    pcbRightEdgeX: true,
    pcbTopEdgeY: true,
    pcbBottomEdgeY: true,
    pcbX: true,
    pcbY: true,
    pcbOffsetX: true,
    pcbOffsetY: true,
    pcbRotation: true,
  })
  .extend({
    outline: z.array(point),
    strokeWidth: length.optional(),
    isClosed: z.boolean().optional(),
    isStrokeDashed: z.boolean().optional(),
    color: z.string().optional(),
  })
```

### courtyard-rect

```typescript
export const courtyardRectProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    width: distance,
    height: distance,
    strokeWidth: distance.optional(),
    isFilled: z.boolean().optional(),
    hasStroke: z.boolean().optional(),
    isStrokeDashed: z.boolean().optional(),
    color: z.string().optional(),
  })
```

### crystal

```typescript
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
export const crystalProps = commonComponentProps.extend({
  frequency: frequency,
  loadCapacitance: capacitance,
  manufacturerPartNumber: z.string().optional(),
  mpn: z.string().optional(),
  pinVariant: z.enum(["two_pin", "four_pin"]).optional(),
  schOrientation: schematicOrientation.optional(),
  connections: createConnectionsProp(crystalPins).optional(),
})
```

### currentsource

```typescript
export interface CurrentSourceProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  current?: number | string
  frequency?: number | string
  peakToPeakCurrent?: number | string
  waveShape?: WaveShape
  phase?: number | string
  dutyCycle?: number | string
  connections?: Connections<CurrentSourcePinLabels>
}
export const currentSourceProps = commonComponentProps.extend({
  current: current.optional(),
  frequency: frequency.optional(),
  peakToPeakCurrent: current.optional(),
  waveShape: z.enum(["sinewave", "square", "triangle", "sawtooth"]).optional(),
  phase: rotation.optional(),
  dutyCycle: percentage.optional(),
  connections: createConnectionsProp(currentSourcePinLabels).optional(),
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
    avalanche: z.boolean().optional(),
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
  variant?: "standard" | "schottky" | "zener" | "avalanche" | "photo" | "tvs"
  standard?: boolean
  schottky?: boolean
  zener?: boolean
  avalanche?: boolean
  photo?: boolean
  tvs?: boolean
  schOrientation?: SchematicOrientation
}
```

### fabrication-note-dimension

```typescript
export interface FabricationNoteDimensionProps
  extends Omit<
    PcbLayoutProps,
    | "pcbLeftEdgeX"
    | "pcbRightEdgeX"
    | "pcbTopEdgeY"
    | "pcbBottomEdgeY"
    | "pcbX"
    | "pcbY"
    | "pcbOffsetX"
    | "pcbOffsetY"
    | "pcbRotation"
  > {
  from: string | Point
  to: string | Point
  text?: string
  offset?: string | number
  font?: "tscircuit2024"
  fontSize?: string | number
  color?: string
  arrowSize?: string | number
  units?: "in" | "mm"
  outerEdgeToEdge?: true
  centerToCenter?: true
  innerEdgeToEdge?: true
}
export const fabricationNoteDimensionProps = pcbLayoutProps
  .omit({
    pcbLeftEdgeX: true,
    pcbRightEdgeX: true,
    pcbTopEdgeY: true,
    pcbBottomEdgeY: true,
    pcbX: true,
    pcbY: true,
    pcbOffsetX: true,
    pcbOffsetY: true,
    pcbRotation: true,
  })
  .extend({
    from: dimensionTarget,
    to: dimensionTarget,
    text: z.string().optional(),
    offset: distance.optional(),
    font: z.enum(["tscircuit2024"]).optional(),
    fontSize: length.optional(),
    color: z.string().optional(),
    arrowSize: distance.optional(),
    units: z.enum(["in", "mm"]).optional(),
    outerEdgeToEdge: z.literal(true).optional(),
    centerToCenter: z.literal(true).optional(),
    innerEdgeToEdge: z.literal(true).optional(),
  })
```

### fabrication-note-path

```typescript
export const fabricationNotePathProps = pcbLayoutProps
  .omit({
    pcbLeftEdgeX: true,
    pcbRightEdgeX: true,
    pcbTopEdgeY: true,
    pcbBottomEdgeY: true,
    pcbX: true,
    pcbY: true,
    pcbOffsetX: true,
    pcbOffsetY: true,
    pcbRotation: true,
  })
  .extend({
    route: z.array(route_hint_point),
    strokeWidth: length.optional(),
    color: z.string().optional(),
  })
```

### fabrication-note-rect

```typescript
export const fabricationNoteRectProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    width: distance,
    height: distance,
    strokeWidth: distance.optional(),
    isFilled: z.boolean().optional(),
    hasStroke: z.boolean().optional(),
    isStrokeDashed: z.boolean().optional(),
    color: z.string().optional(),
    cornerRadius: distance.optional(),
  })
```

### fabrication-note-text

```typescript
export interface FabricationNoteTextProps extends PcbLayoutProps {
  text: string
  anchorAlignment?:
    | "center"
    | "top_left"
    | "top_right"
    | "bottom_left"
    | "bottom_right"
  font?: "tscircuit2024"
  fontSize?: string | number
  color?: string
}
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

### fiducial

```typescript
export interface FiducialProps extends CommonComponentProps {
  soldermaskPullback?: Distance
  padDiameter?: Distance
}
export const fiducialProps = commonComponentProps.extend({
  soldermaskPullback: distance.optional(),
  padDiameter: distance.optional(),
})
```

### footprint

```typescript
export interface FootprintProps {
  children?: any
  originalLayer?: LayerRef
  circuitJson?: any[]
}
/**
   * Serialized circuit JSON describing a precompiled footprint
   */
export const footprintProps = z.object({
  children: z.any().optional(),
  originalLayer: layer_ref.default("top").optional(),
  circuitJson: z.array(z.any()).optional(),
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
  layoutMode: z
    .enum(["grid", "flex", "match-adapt", "relative", "none"])
    .optional(),
  position: z.enum(["absolute", "relative"]).optional(),

  grid: z.boolean().optional(),
  gridCols: z.number().or(z.string()).optional(),
  gridRows: z.number().or(z.string()).optional(),
  gridTemplateRows: z.string().optional(),
  gridTemplateColumns: z.string().optional(),
  gridTemplate: z.string().optional(),
  gridGap: z.number().or(z.string()).optional(),
  gridRowGap: z.number().or(z.string()).optional(),
  gridColumnGap: z.number().or(z.string()).optional(),

  flex: z.boolean().or(z.string()).optional(),
  flexDirection: z.enum(["row", "column"]).optional(),
  alignItems: z.enum(["start", "center", "end", "stretch"]).optional(),
  justifyContent: z
    .enum([
      "start",
      "center",
      "end",
      "stretch",
      "space-between",
      "space-around",
      "space-evenly",
    ])
    .optional(),
  flexRow: z.boolean().optional(),
  flexColumn: z.boolean().optional(),
  gap: z.number().or(z.string()).optional(),

  pack: z
    .boolean()
    .optional()
    .describe("Pack the contents of this group using a packing strategy"),
  packOrderStrategy: z
    .enum([
      "largest_to_smallest",
      "first_to_last",
      "highest_to_lowest_pin_count",
    ])
    .optional(),
  packPlacementStrategy: z
    .enum(["shortest_connection_along_outline"])
    .optional(),

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

  pcbStyle?: PcbStyle

  schTitle?: string

  showAsSchematicBox?: boolean

  connections?: Connections

  schPinArrangement?: SchematicPinArrangement

  schPinSpacing?: Distance

  schPinStyle?: SchematicPinStyle

  pcbWidth?: Distance
  pcbHeight?: Distance
  minTraceWidth?: Distance
  nominalTraceWidth?: Distance
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
  pcbAnchorAlignment?: AutocompleteString<z.infer<typeof ninePointAnchor>>

  grid?: boolean
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
/** @deprecated Use `pcbFlex` */
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
  availableJumperTypes?: Array<"1206x4" | "0603">
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
    | "auto_jumper"
    | "tscircuit_beta"
    | "freerouting"
    | "laser_prefab" // Prefabricated PCB with laser copper ablation
    | /** @deprecated Use "auto_jumper" */ "auto-jumper"
    | /** @deprecated Use "sequential_trace" */ "sequential-trace"
    | /** @deprecated Use "auto_local" */ "auto-local"
    | /** @deprecated Use "auto_cloud" */ "auto-cloud"
}
export const autorouterConfig = z.object({
  serverUrl: z.string().optional(),
  inputFormat: z.enum(["simplified", "circuit-json"]).optional(),
  serverMode: z.enum(["job", "solve-endpoint"]).optional(),
  serverCacheEnabled: z.boolean().optional(),
  cache: z.custom<PcbRouteCache>((v) => true).optional(),
  traceClearance: length.optional(),
  availableJumperTypes: z.array(z.enum(["1206x4", "0603"])).optional(),
  groupMode: z
    .enum(["sequential_trace", "subcircuit", "sequential-trace"])
    .optional(),
  algorithmFn: z
    .custom<(simpleRouteJson: any) => Promise<any>>(
      (v) => typeof v === "function" || v === undefined,
    )
    .optional(),
  preset: z
    .enum([
      "sequential_trace",
      "subcircuit",
      "auto",
      "auto_local",
      "auto_cloud",
      "auto_jumper",
      "tscircuit_beta",
      "freerouting",
      "laser_prefab",
      "auto-jumper",
      "sequential-trace",
      "auto-local",
      "auto-cloud",
    ])
    .optional(),
  local: z.boolean().optional(),
})
export interface SubcircuitGroupProps extends BaseGroupProps {
  manualEdits?: ManualEditsFileInput
  routingDisabled?: boolean
  bomDisabled?: boolean
  defaultTraceWidth?: Distance
  minTraceWidth?: Distance
  nominalTraceWidth?: Distance
  pcbRouteCache?: PcbRouteCache

  autorouter?: AutorouterProp
  autorouterEffortLevel?: "1x" | "2x" | "5x" | "10x" | "100x"
  autorouterVersion?: "v1" | "v2" | "latest"

  circuitJson?: any[]

  schAutoLayoutEnabled?: boolean

  schTraceAutoLabelEnabled?: boolean

  schMaxTraceDistance?: Distance

  partsEngine?: PartsEngine

  square?: boolean
  emptyArea?: string
  filledArea?: string

  width?: number | string
  height?: number | string
  outline?: Point[]
  outlineOffsetX?: number | string
  outlineOffsetY?: number | string
}
/** Desired filled area of the board e.g. "22mm^2" or "20%" */
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
  showAsSchematicBox: z.boolean().optional(),
  connections: z.record(z.string(), connectionTarget.optional()).optional(),
  schPinArrangement: schematicPinArrangement.optional(),
  schPinSpacing: length.optional(),
  schPinStyle: schematicPinStyle.optional(),

  ...layoutConfig.shape,
  grid: layoutConfig.shape.grid.describe("@deprecated use pcbGrid"),
  flex: layoutConfig.shape.flex.describe("@deprecated use pcbFlex"),
  pcbGrid: z.boolean().optional(),
  pcbGridCols: z.number().or(z.string()).optional(),
  pcbGridRows: z.number().or(z.string()).optional(),
  pcbGridTemplateRows: z.string().optional(),
  pcbGridTemplateColumns: z.string().optional(),
  pcbGridTemplate: z.string().optional(),
  pcbGridGap: z.number().or(z.string()).optional(),
  pcbGridRowGap: z.number().or(z.string()).optional(),
  pcbGridColumnGap: z.number().or(z.string()).optional(),
  pcbFlex: z.boolean().or(z.string()).optional(),
  pcbFlexGap: z.number().or(z.string()).optional(),
  pcbFlexDirection: z.enum(["row", "column"]).optional(),
  pcbAlignItems: z.enum(["start", "center", "end", "stretch"]).optional(),
  pcbJustifyContent: z
    .enum([
      "start",
      "center",
      "end",
      "stretch",
      "space-between",
      "space-around",
      "space-evenly",
    ])
    .optional(),
  pcbFlexRow: z.boolean().optional(),
  pcbFlexColumn: z.boolean().optional(),
  pcbGap: z.number().or(z.string()).optional(),
  pcbPack: z.boolean().optional(),
  pcbPackGap: z.number().or(z.string()).optional(),

  schGrid: z.boolean().optional(),
  schGridCols: z.number().or(z.string()).optional(),
  schGridRows: z.number().or(z.string()).optional(),
  schGridTemplateRows: z.string().optional(),
  schGridTemplateColumns: z.string().optional(),
  schGridTemplate: z.string().optional(),
  schGridGap: z.number().or(z.string()).optional(),
  schGridRowGap: z.number().or(z.string()).optional(),
  schGridColumnGap: z.number().or(z.string()).optional(),

  schFlex: z.boolean().or(z.string()).optional(),
  schFlexGap: z.number().or(z.string()).optional(),
  schFlexDirection: z.enum(["row", "column"]).optional(),
  schAlignItems: z.enum(["start", "center", "end", "stretch"]).optional(),
  schJustifyContent: z
    .enum([
      "start",
      "center",
      "end",
      "stretch",
      "space-between",
      "space-around",
      "space-evenly",
    ])
    .optional(),
  schFlexRow: z.boolean().optional(),
  schFlexColumn: z.boolean().optional(),
  schGap: z.number().or(z.string()).optional(),
  schPack: z.boolean().optional(),
  schMatchAdapt: z.boolean().optional(),
  pcbWidth: length.optional(),
  pcbHeight: length.optional(),
  minTraceWidth: length.optional(),
  nominalTraceWidth: length.optional(),
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
  pcbPadding: length.optional(),
  pcbPaddingLeft: length.optional(),
  pcbPaddingRight: length.optional(),
  pcbPaddingTop: length.optional(),
  pcbPaddingBottom: length.optional(),
  pcbAnchorAlignment: pcbAnchorAlignmentAutocomplete.optional(),
})
export const subcircuitGroupProps = baseGroupProps.extend({
  manualEdits: manual_edits_file.optional(),
  schAutoLayoutEnabled: z.boolean().optional(),
  schTraceAutoLabelEnabled: z.boolean().optional(),
  schMaxTraceDistance: distance.optional(),
  routingDisabled: z.boolean().optional(),
  bomDisabled: z.boolean().optional(),
  defaultTraceWidth: length.optional(),
  minTraceWidth: length.optional(),
  nominalTraceWidth: length.optional(),
  partsEngine: partsEngine.optional(),
  pcbRouteCache: z.custom<PcbRouteCache>((v) => true).optional(),
  autorouter: autorouterProp.optional(),
  autorouterEffortLevel: autorouterEffortLevel.optional(),
  autorouterVersion: z.enum(["v1", "v2", "latest"]).optional(),
  square: z.boolean().optional(),
  emptyArea: z.string().optional(),
  filledArea: z.string().optional(),
  width: distance.optional(),
  height: distance.optional(),
  outline: z.array(point).optional(),
  outlineOffsetX: distance.optional(),
  outlineOffsetY: distance.optional(),
  circuitJson: z.array(z.any()).optional(),
})
export const subcircuitGroupPropsWithBool = subcircuitGroupProps.extend({
  subcircuit: z.literal(true),
})
```

### hole

```typescript
export interface CircleHoleProps extends PcbLayoutProps {
  name?: string
  shape?: "circle"
  diameter?: Distance
  radius?: Distance
  solderMaskMargin?: Distance
  coveredWithSolderMask?: boolean
}
export interface PillHoleProps extends PcbLayoutProps {
  name?: string
  shape: "pill"
  width: Distance
  height: Distance
  solderMaskMargin?: Distance
  coveredWithSolderMask?: boolean
}
export interface RectHoleProps extends PcbLayoutProps {
  name?: string
  shape: "rect"
  width: Distance
  height: Distance
  solderMaskMargin?: Distance
  coveredWithSolderMask?: boolean
}
.extend({
    name: z.string().optional(),
    shape: z.literal("circle").optional(),
    diameter: distance.optional(),
    radius: distance.optional(),
    solderMaskMargin: distance.optional(),
    coveredWithSolderMask: z.boolean().optional(),
  })
const pillHoleProps = pcbLayoutProps.extend({
  name: z.string().optional(),
  shape: z.literal("pill"),
  width: distance,
  height: distance,
  solderMaskMargin: distance.optional(),
  coveredWithSolderMask: z.boolean().optional(),
})
const rectHoleProps = pcbLayoutProps.extend({
  name: z.string().optional(),
  shape: z.literal("rect"),
  width: distance,
  height: distance,
  solderMaskMargin: distance.optional(),
  coveredWithSolderMask: z.boolean().optional(),
})
```

### inductor

```typescript
export interface InductorProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  inductance: number | string
  maxCurrentRating?: number | string
  schOrientation?: SchematicOrientation
  connections?: Connections<InductorPinLabels>
}
export const inductorProps = commonComponentProps.extend({
  inductance,
  maxCurrentRating: z.union([z.string(), z.number()]).optional(),
  schOrientation: schematicOrientation.optional(),
  connections: createConnectionsProp(inductorPins).optional(),
})
```

### interconnect

```typescript
export interface InterconnectProps extends CommonComponentProps {
  standard?: "TSC0001_36P_XALT_2025_11" | "0805" | "0603" | "1206"
  pinLabels?: Record<
    number | SchematicPinLabel,
    SchematicPinLabel | SchematicPinLabel[]
  >
  internallyConnectedPins?: (string | number)[][]
}
/**
   * Groups of pins that are internally connected
   * e.g., [["1","2"], ["2","3"]]
   */
export const interconnectProps = commonComponentProps.extend({
  standard: z
    .enum(["TSC0001_36P_XALT_2025_11", "0805", "0603", "1206"])
    .optional(),
  pinLabels: z
    .record(
      z.number().or(schematicPinLabel),
      schematicPinLabel.or(z.array(schematicPinLabel)),
    )
    .optional(),
  internallyConnectedPins: z
    .array(z.array(z.union([z.string(), z.number()])))
    .optional(),
})
```

### jumper

```typescript
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
  schPortArrangement?: SchematicPortArrangement
  pcbPinLabels?: Record<string, string>
  pinCount?: 2 | 3
  internallyConnectedPins?: (string | number)[][]
  connections?: Connections<string>
}
/**
   * Connections to other components
   */
export const jumperProps = commonComponentProps.extend({
  manufacturerPartNumber: z.string().optional(),
  pinLabels: z
    .record(
      z.number().or(schematicPinLabel),
      schematicPinLabel.or(z.array(schematicPinLabel)),
    )
    .optional(),
  schPinStyle: schematicPinStyle.optional(),
  schPinSpacing: distance.optional(),
  schWidth: distance.optional(),
  schHeight: distance.optional(),
  schDirection: z.enum(["left", "right"]).optional(),
  schPinArrangement: schematicPinArrangement.optional(),
  schPortArrangement: schematicPortArrangement.optional(),
  pcbPinLabels: z.record(z.string(), z.string()).optional(),
  pinCount: z.union([z.literal(2), z.literal(3)]).optional(),
  internallyConnectedPins: z
    .array(z.array(z.union([z.string(), z.number()])))
    .optional(),
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
  laser: z.boolean().optional(),
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
  highlightColor?: string
  isPowerNet?: boolean
  isGroundNet?: boolean
}
export const netProps = z.object({
  name: z.string(),
  connectsTo: z.string().or(z.array(z.string())).optional(),
  highlightColor: z.string().optional(),
  isPowerNet: z.boolean().optional(),
  isGroundNet: z.boolean().optional(),
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

### opamp

```typescript
export const opampPinLabels = [
  "inverting_input",
  "non_inverting_input",
  "output",
  "positive_supply",
  "negative_supply",
] as const
export interface OpAmpProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  connections?: Connections<OpAmpPinLabels>
}
/**
 * Zod schema for validating op-amp props.
 */
export const opampProps = commonComponentProps.extend({
  connections: createConnectionsProp(opampPinLabels).optional(),
})
```

### panel

```typescript
export interface PanelProps
  extends Omit<BaseGroupProps, "height" | "layoutMode" | "width"> {
  width?: Distance
  height?: Distance
  children?: BaseGroupProps["children"]
  anchorAlignment?: z.infer<typeof ninePointAnchor>
  noSolderMask?: boolean
  panelizationMethod?: "tab-routing" | "none"
  boardGap?: Distance
  layoutMode?: "grid" | "pack" | "none"
  row?: number
  col?: number
  cellWidth?: Distance
  cellHeight?: Distance
  tabWidth?: Distance
  tabLength?: Distance
  mouseBites?: boolean
  edgePadding?: Distance
  edgePaddingLeft?: Distance
  edgePaddingRight?: Distance
  edgePaddingTop?: Distance
  edgePaddingBottom?: Distance
}
/** Gap between boards in a panel */
export const panelProps = baseGroupProps
  .omit({
    width: true,
    height: true,
    layoutMode: true,
    children: true,
  })
  .extend({
    width: distance.optional(),
    height: distance.optional(),
    children: z.any().optional(),
    anchorAlignment: ninePointAnchor.optional(),
    noSolderMask: z.boolean().optional(),
    panelizationMethod: z.enum(["tab-routing", "none"]).optional(),
    boardGap: distance.optional(),
    layoutMode: z.enum(["grid", "pack", "none"]).optional(),
    row: z.number().optional(),
    col: z.number().optional(),
    cellWidth: distance.optional(),
    cellHeight: distance.optional(),
    tabWidth: distance.optional(),
    tabLength: distance.optional(),
    mouseBites: z.boolean().optional(),
    edgePadding: distance.optional(),
    edgePaddingLeft: distance.optional(),
    edgePaddingRight: distance.optional(),
    edgePaddingTop: distance.optional(),
    edgePaddingBottom: distance.optional(),
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

### pcb-note-dimension

```typescript
export interface PcbNoteDimensionProps
  extends Omit<
    PcbLayoutProps,
    | "pcbLeftEdgeX"
    | "pcbRightEdgeX"
    | "pcbTopEdgeY"
    | "pcbBottomEdgeY"
    | "pcbX"
    | "pcbY"
    | "pcbOffsetX"
    | "pcbOffsetY"
    | "pcbRotation"
  > {
  from: string | Point
  to: string | Point
  text?: string
  offset?: string | number
  font?: "tscircuit2024"
  fontSize?: string | number
  color?: string
  arrowSize?: string | number
  units?: "in" | "mm"
  outerEdgeToEdge?: true
  centerToCenter?: true
  innerEdgeToEdge?: true
}
export const pcbNoteDimensionProps = pcbLayoutProps
  .omit({
    pcbLeftEdgeX: true,
    pcbRightEdgeX: true,
    pcbTopEdgeY: true,
    pcbBottomEdgeY: true,
    pcbX: true,
    pcbY: true,
    pcbOffsetX: true,
    pcbOffsetY: true,
    pcbRotation: true,
  })
  .extend({
    from: dimensionTarget,
    to: dimensionTarget,
    text: z.string().optional(),
    offset: distance.optional(),
    font: z.enum(["tscircuit2024"]).optional(),
    fontSize: length.optional(),
    color: z.string().optional(),
    arrowSize: distance.optional(),
    units: z.enum(["in", "mm"]).optional(),
    outerEdgeToEdge: z.literal(true).optional(),
    centerToCenter: z.literal(true).optional(),
    innerEdgeToEdge: z.literal(true).optional(),
  })
```

### pcb-note-line

```typescript
export interface PcbNoteLineProps
  extends Omit<
    PcbLayoutProps,
    | "pcbLeftEdgeX"
    | "pcbRightEdgeX"
    | "pcbTopEdgeY"
    | "pcbBottomEdgeY"
    | "pcbX"
    | "pcbY"
    | "pcbOffsetX"
    | "pcbOffsetY"
    | "pcbRotation"
  > {
  x1: string | number
  y1: string | number
  x2: string | number
  y2: string | number
  strokeWidth?: string | number
  color?: string
  isDashed?: boolean
}
export const pcbNoteLineProps = pcbLayoutProps
  .omit({
    pcbLeftEdgeX: true,
    pcbRightEdgeX: true,
    pcbTopEdgeY: true,
    pcbBottomEdgeY: true,
    pcbX: true,
    pcbY: true,
    pcbOffsetX: true,
    pcbOffsetY: true,
    pcbRotation: true,
  })
  .extend({
    x1: distance,
    y1: distance,
    x2: distance,
    y2: distance,
    strokeWidth: distance.optional(),
    color: z.string().optional(),
    isDashed: z.boolean().optional(),
  })
```

### pcb-note-path

```typescript
export interface PcbNotePathProps
  extends Omit<
    PcbLayoutProps,
    | "pcbLeftEdgeX"
    | "pcbRightEdgeX"
    | "pcbTopEdgeY"
    | "pcbBottomEdgeY"
    | "pcbX"
    | "pcbY"
    | "pcbOffsetX"
    | "pcbOffsetY"
    | "pcbRotation"
  > {
  route: RouteHintPointInput[]
  strokeWidth?: string | number
  color?: string
}
export const pcbNotePathProps = pcbLayoutProps
  .omit({
    pcbLeftEdgeX: true,
    pcbRightEdgeX: true,
    pcbTopEdgeY: true,
    pcbBottomEdgeY: true,
    pcbX: true,
    pcbY: true,
    pcbOffsetX: true,
    pcbOffsetY: true,
    pcbRotation: true,
  })
  .extend({
    route: z.array(route_hint_point),
    strokeWidth: length.optional(),
    color: z.string().optional(),
  })
```

### pcb-note-rect

```typescript
export interface PcbNoteRectProps extends Omit<PcbLayoutProps, "pcbRotation"> {
  width: string | number
  height: string | number
  strokeWidth?: string | number
  isFilled?: boolean
  hasStroke?: boolean
  isStrokeDashed?: boolean
  color?: string
  cornerRadius?: string | number
}
export const pcbNoteRectProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    width: distance,
    height: distance,
    strokeWidth: distance.optional(),
    isFilled: z.boolean().optional(),
    hasStroke: z.boolean().optional(),
    isStrokeDashed: z.boolean().optional(),
    color: z.string().optional(),
    cornerRadius: distance.optional(),
  })
```

### pcb-note-text

```typescript
export interface PcbNoteTextProps extends PcbLayoutProps {
  text: string
  anchorAlignment?:
    | "center"
    | "top_left"
    | "top_right"
    | "bottom_left"
    | "bottom_right"
  font?: "tscircuit2024"
  fontSize?: string | number
  color?: string
}
export const pcbNoteTextProps = pcbLayoutProps.extend({
  text: z.string(),
  anchorAlignment: z
    .enum(["center", "top_left", "top_right", "bottom_left", "bottom_right"])
    .default("center"),
  font: z.enum(["tscircuit2024"]).optional(),
  fontSize: length.optional(),
  color: z.string().optional(),
})
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

  gender?: "male" | "female" | "unpopulated"

  showSilkscreenPinLabels?: boolean

  pcbPinLabels?: Record<string, string>

  doubleRow?: boolean

  rightAngle?: boolean

  pcbOrientation?: PcbOrientation

  holeDiameter?: number | string

  platedDiameter?: number | string

  pinLabels?: Record<string, SchematicPinLabel> | SchematicPinLabel[]

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
  gender: z.enum(["male", "female", "unpopulated"]).optional().default("male"),
  showSilkscreenPinLabels: z.boolean().optional(),
  pcbPinLabels: z.record(z.string(), z.string()).optional(),
  doubleRow: z.boolean().optional(),
  rightAngle: z.boolean().optional(),
  pcbOrientation: pcbOrientationProp.optional(),
  holeDiameter: distance.optional(),
  platedDiameter: distance.optional(),
  pinLabels: z
    .record(z.string(), schematicPinLabel)
    .or(z.array(schematicPinLabel))
    .optional(),
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

### pinout

```typescript
export interface PinoutProps<
  PinLabelMap extends PinLabelsProp | string = string,
> extends ChipProps<PinLabelMap> {}
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
  padDiameter?: number | string
  portHints?: PortHints
  solderMaskMargin?: Distance
  coveredWithSolderMask?: boolean
}
export interface OvalPlatedHoleProps extends Omit<PcbLayoutProps, "layer"> {
  name?: string
  connectsTo?: string | string[]
  shape: "oval"
  outerWidth: number | string
  outerHeight: number | string
  holeWidth: number | string
  holeHeight: number | string
  portHints?: PortHints
  solderMaskMargin?: Distance

  innerWidth?: number | string
  innerHeight?: number | string
  coveredWithSolderMask?: boolean
}
/** @deprecated use holeHeight */
export interface PillPlatedHoleProps extends Omit<PcbLayoutProps, "layer"> {
  name?: string
  rectPad?: boolean
  connectsTo?: string | string[]
  shape: "pill"
  outerWidth: number | string
  outerHeight: number | string
  holeWidth: number | string
  holeHeight: number | string
  holeOffsetX?: number | string
  holeOffsetY?: number | string

  innerWidth?: number | string
  innerHeight?: number | string

  portHints?: PortHints
  solderMaskMargin?: Distance
  coveredWithSolderMask?: boolean
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
  rectBorderRadius?: number | string
  holeShape?: "circle"
  padShape?: "rect"
  portHints?: PortHints
  holeOffsetX?: number | string
  holeOffsetY?: number | string
  solderMaskMargin?: Distance
  coveredWithSolderMask?: boolean
}
export interface PillWithRectPadPlatedHoleProps
  extends Omit<PcbLayoutProps, "pcbRotation" | "layer"> {
  name?: string
  connectsTo?: string | string[]
  shape: "pill_hole_with_rect_pad"
  holeShape?: "pill"
  padShape?: "rect"
  holeWidth: number | string
  holeHeight: number | string
  rectPadWidth: number | string
  rectPadHeight: number | string
  portHints?: PortHints
  holeOffsetX?: number | string
  holeOffsetY?: number | string
  solderMaskMargin?: Distance
  coveredWithSolderMask?: boolean
}
export interface HoleWithPolygonPadPlatedHoleProps
  extends Omit<PcbLayoutProps, "pcbRotation" | "layer"> {
  name?: string
  connectsTo?: string | string[]
  shape: "hole_with_polygon_pad"
  holeShape: "circle" | "oval" | "pill" | "rotated_pill"
  holeDiameter?: number | string
  holeWidth?: number | string
  holeHeight?: number | string
  padOutline: Point[]
  holeOffsetX: number | string
  holeOffsetY: number | string
  portHints?: PortHints
  solderMaskMargin?: Distance
  coveredWithSolderMask?: boolean
}
export type PlatedHoleProps =
  | CirclePlatedHoleProps
  | OvalPlatedHoleProps
  | PillPlatedHoleProps
  | CircularHoleWithRectPlatedProps
  | PillWithRectPadPlatedHoleProps
  | HoleWithPolygonPadPlatedHoleProps

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
      padDiameter: distance.optional().describe("Diameter of the copper pad"),
      portHints: portHints.optional(),
      solderMaskMargin: distance.optional(),
      coveredWithSolderMask: z.boolean().optional(),
    }),
pcbLayoutProps.omit({ layer: true }).extend({
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
      solderMaskMargin: distance.optional(),
      coveredWithSolderMask: z.boolean().optional(),
    }),
pcbLayoutProps.omit({ layer: true }).extend({
      name: z.string().optional(),
      connectsTo: z.string().or(z.array(z.string())).optional(),
      shape: z.literal("pill"),
      rectPad: z.boolean().optional(),
      outerWidth: distance,
      outerHeight: distance,
      holeWidth: distanceHiddenUndefined,
      holeHeight: distanceHiddenUndefined,
      innerWidth: distance.optional().describe("DEPRECATED use holeWidth"),
      innerHeight: distance.optional().describe("DEPRECATED use holeHeight"),
      portHints: portHints.optional(),
      holeOffsetX: distance.optional(),
      holeOffsetY: distance.optional(),
      solderMaskMargin: distance.optional(),
      coveredWithSolderMask: z.boolean().optional(),
    }),
pcbLayoutProps.omit({ pcbRotation: true, layer: true }).extend({
      name: z.string().optional(),
      connectsTo: z.string().or(z.array(z.string())).optional(),
      shape: z.literal("circular_hole_with_rect_pad"),
      holeDiameter: distance,
      rectPadWidth: distance,
      rectPadHeight: distance,
      rectBorderRadius: distance.optional(),
      holeShape: z.literal("circle").optional(),
      padShape: z.literal("rect").optional(),
      portHints: portHints.optional(),
      holeOffsetX: distance.optional(),
      holeOffsetY: distance.optional(),
      solderMaskMargin: distance.optional(),
      coveredWithSolderMask: z.boolean().optional(),
    }),
pcbLayoutProps.omit({ pcbRotation: true, layer: true }).extend({
      name: z.string().optional(),
      connectsTo: z.string().or(z.array(z.string())).optional(),
      shape: z.literal("pill_hole_with_rect_pad"),
      holeShape: z.literal("pill").optional(),
      padShape: z.literal("rect").optional(),
      holeWidth: distance,
      holeHeight: distance,
      rectPadWidth: distance,
      rectPadHeight: distance,
      portHints: portHints.optional(),
      holeOffsetX: distance.optional(),
      holeOffsetY: distance.optional(),
      solderMaskMargin: distance.optional(),
      coveredWithSolderMask: z.boolean().optional(),
    }),
pcbLayoutProps.omit({ pcbRotation: true, layer: true }).extend({
      name: z.string().optional(),
      connectsTo: z.string().or(z.array(z.string())).optional(),
      shape: z.literal("hole_with_polygon_pad"),
      holeShape: z.enum(["circle", "oval", "pill", "rotated_pill"]),
      holeDiameter: distance.optional(),
      holeWidth: distance.optional(),
      holeHeight: distance.optional(),
      padOutline: z.array(point),
      holeOffsetX: distance,
      holeOffsetY: distance,
      portHints: portHints.optional(),
      solderMaskMargin: distance.optional(),
      coveredWithSolderMask: z.boolean().optional(),
    }),
```

### port

```typescript
export const portProps = commonLayoutProps.extend({
  name: z.string(),
  pinNumber: z.number().optional(),
  aliases: z.array(z.string()).optional(),
  direction: direction,
  connectsTo: z.string().or(z.array(z.string())).optional(),
  kicadPinMetadata: kicadPinMetadata.optional(),
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
  schSize?: SchematicSymbolSize
  connections?: Connections<ResistorPinLabels>
}
export const resistorProps = commonComponentProps.extend({
  resistance,

  pullupFor: z.string().optional(),
  pullupTo: z.string().optional(),

  pulldownFor: z.string().optional(),
  pulldownTo: z.string().optional(),

  schOrientation: schematicOrientation.optional(),
  schSize: schematicSymbolSize.optional(),

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

### schematic-arc

```typescript
export const schematicArcProps = z.object({
  center: point,
  radius: distance,
  startAngleDegrees: rotation,
  endAngleDegrees: rotation,
  direction: z
    .enum(["clockwise", "counterclockwise"])
    .default("counterclockwise"),
  strokeWidth: distance.optional(),
  color: z.string().optional(),
  isDashed: z.boolean().optional().default(false),
})
export interface SchematicArcProps {
  center: Point
  radius: Distance
  startAngleDegrees: number | string
  endAngleDegrees: number | string
  direction?: "clockwise" | "counterclockwise"
  strokeWidth?: Distance
  color?: string
  isDashed?: boolean
}
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
export interface SchematicBoxProps {
  schX?: Distance
  schY?: Distance
  width?: Distance
  height?: Distance
  overlay?: string[]
  padding?: Distance
  paddingLeft?: Distance
  paddingRight?: Distance
  paddingTop?: Distance
  paddingBottom?: Distance
  title?: string
  titleAlignment?: z.infer<typeof ninePointAnchor>
  titleColor?: string
  titleFontSize?: Distance
  titleInside?: boolean
  strokeStyle?: "solid" | "dashed"
}
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
  text: z.string().optional(),
})
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
```

### schematic-circle

```typescript
export const schematicCircleProps = z.object({
  center: point,
  radius: distance,
  strokeWidth: distance.optional(),
  color: z.string().optional(),
  isFilled: z.boolean().optional().default(false),
  fillColor: z.string().optional(),
  isDashed: z.boolean().optional().default(false),
})
export interface SchematicCircleProps {
  center: Point
  radius: Distance
  strokeWidth?: Distance
  color?: string
  isFilled?: boolean
  fillColor?: string
  isDashed?: boolean
}
```

### schematic-line

```typescript
export const schematicLineProps = z.object({
  x1: distance,
  y1: distance,
  x2: distance,
  y2: distance,
  strokeWidth: distance.optional(),
  color: z.string().optional(),
  isDashed: z.boolean().optional().default(false),
})
export interface SchematicLineProps {
  x1: Distance
  y1: Distance
  x2: Distance
  y2: Distance
  strokeWidth?: Distance
  color?: string
  isDashed?: boolean
}
```

### schematic-path

```typescript
export const schematicPathProps = z.object({
  points: z.array(point).optional(),
  svgPath: z.string().optional(),
  strokeWidth: distance.optional(),
  strokeColor: z.string().optional(),
  isFilled: z.boolean().optional().default(false),
  fillColor: z.enum(["red", "blue"]).optional(),
})
export interface SchematicPathProps {
  points?: Point[]
  svgPath?: string
  strokeWidth?: Distance
  strokeColor?: string
  isFilled?: boolean
  fillColor?: "red" | "blue"
}
```

### schematic-rect

```typescript
export const schematicRectProps = z.object({
  schX: distance.optional(),
  schY: distance.optional(),
  width: distance,
  height: distance,
  rotation: rotation.default(0),
  strokeWidth: distance.optional(),
  color: z.string().optional(),
  isFilled: z.boolean().optional().default(false),
  fillColor: z.string().optional(),
  isDashed: z.boolean().optional().default(false),
  cornerRadius: distance.optional(),
})
export interface SchematicRectProps {
  schX?: Distance
  schY?: Distance
  width: Distance
  height: Distance
  rotation?: number | string
  strokeWidth?: Distance
  color?: string
  isFilled?: boolean
  fillColor?: string
  isDashed?: boolean
  cornerRadius?: Distance
}
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
export interface SchematicTextProps {
  schX?: Distance
  schY?: Distance
  text: string
  fontSize?: number
  anchor?: z.infer<typeof fivePointAnchor> | z.infer<typeof ninePointAnchor>
  color?: string
  schRotation?: number | string
}
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
  .omit({
    pcbX: true,
    pcbY: true,
    pcbOffsetX: true,
    pcbOffsetY: true,
    pcbRotation: true,
  })
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
  .omit({
    pcbLeftEdgeX: true,
    pcbRightEdgeX: true,
    pcbTopEdgeY: true,
    pcbBottomEdgeY: true,
    pcbX: true,
    pcbY: true,
    pcbOffsetX: true,
    pcbOffsetY: true,
    pcbRotation: true,
  })
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
    cornerRadius: distance.optional(),
  })
```

### silkscreen-text

```typescript
export const silkscreenTextProps = pcbLayoutProps.extend({
  text: z.string(),
  anchorAlignment: ninePointAnchor.default("center"),
  font: z.enum(["tscircuit2024"]).optional(),
  fontSize: length.optional(),
  isKnockout: z.boolean().optional(),
  knockoutPadding: length.optional(),
  knockoutPaddingLeft: length.optional(),
  knockoutPaddingRight: length.optional(),
  knockoutPaddingTop: length.optional(),
  knockoutPaddingBottom: length.optional(),
  layers: z.array(layer_ref).optional(),
})
```

### smtpad

```typescript
export interface RectSmtPadProps extends Omit<PcbLayoutProps, "pcbRotation"> {
  name?: string
  shape: "rect"
  width: Distance
  height: Distance
  rectBorderRadius?: Distance
  cornerRadius?: Distance
  portHints?: PortHints
  coveredWithSolderMask?: boolean
  solderMaskMargin?: Distance
  solderMaskMarginLeft?: Distance
  solderMaskMarginRight?: Distance
  solderMaskMarginTop?: Distance
  solderMaskMarginBottom?: Distance
}
export interface RotatedRectSmtPadProps
  extends Omit<PcbLayoutProps, "pcbRotation"> {
  name?: string
  shape: "rotated_rect"
  width: Distance
  height: Distance
  cornerRadius?: Distance
  ccwRotation: number
  portHints?: PortHints
  coveredWithSolderMask?: boolean
  solderMaskMargin?: Distance
  solderMaskMarginLeft?: Distance
  solderMaskMarginRight?: Distance
  solderMaskMarginTop?: Distance
  solderMaskMarginBottom?: Distance
}
export interface CircleSmtPadProps extends Omit<PcbLayoutProps, "pcbRotation"> {
  name?: string
  shape: "circle"
  radius: Distance
  portHints?: PortHints
  coveredWithSolderMask?: boolean
  solderMaskMargin?: Distance
}
export interface PillSmtPadProps extends Omit<PcbLayoutProps, "pcbRotation"> {
  name?: string
  shape: "pill"
  width: Distance
  height: Distance
  radius: Distance
  portHints?: PortHints
  coveredWithSolderMask?: boolean
  solderMaskMargin?: Distance
}
export interface PolygonSmtPadProps
  extends Omit<PcbLayoutProps, "pcbRotation"> {
  name?: string
  shape: "polygon"
  points: Point[]
  portHints?: PortHints
  coveredWithSolderMask?: boolean
  solderMaskMargin?: Distance
}
export const rectSmtPadProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    name: z.string().optional(),
    shape: z.literal("rect"),
    width: distance,
    height: distance,
    rectBorderRadius: distance.optional(),
    cornerRadius: distance.optional(),
    portHints: portHints.optional(),
    coveredWithSolderMask: z.boolean().optional(),
    solderMaskMargin: distance.optional(),
    solderMaskMarginLeft: distance.optional(),
    solderMaskMarginRight: distance.optional(),
    solderMaskMarginTop: distance.optional(),
    solderMaskMarginBottom: distance.optional(),
  })
export const rotatedRectSmtPadProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    name: z.string().optional(),
    shape: z.literal("rotated_rect"),
    width: distance,
    height: distance,
    ccwRotation: z.number(),
    cornerRadius: distance.optional(),
    portHints: portHints.optional(),
    coveredWithSolderMask: z.boolean().optional(),
    solderMaskMargin: distance.optional(),
    solderMaskMarginLeft: distance.optional(),
    solderMaskMarginRight: distance.optional(),
    solderMaskMarginTop: distance.optional(),
    solderMaskMarginBottom: distance.optional(),
  })
export const circleSmtPadProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    name: z.string().optional(),
    shape: z.literal("circle"),
    radius: distance,
    portHints: portHints.optional(),
    coveredWithSolderMask: z.boolean().optional(),
    solderMaskMargin: distance.optional(),
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
    coveredWithSolderMask: z.boolean().optional(),
    solderMaskMargin: distance.optional(),
  })
export const polygonSmtPadProps = pcbLayoutProps
  .omit({ pcbRotation: true })
  .extend({
    name: z.string().optional(),
    shape: z.literal("polygon"),
    points: z.array(point),
    portHints: portHints.optional(),
    coveredWithSolderMask: z.boolean().optional(),
    solderMaskMargin: distance.optional(),
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
  simSwitchFrequency?: number | string
  simCloseAt?: number | string
  simOpenAt?: number | string
  simStartClosed?: boolean
  simStartOpen?: boolean
  connections?: Connections<string>
}
.extend({
    type: z.enum(["spst", "spdt", "dpst", "dpdt"]).optional(),
    isNormallyClosed: z.boolean().optional().default(false),
    spst: z.boolean().optional(),
    spdt: z.boolean().optional(),
    dpst: z.boolean().optional(),
    dpdt: z.boolean().optional(),
    simSwitchFrequency: frequency.optional(),
    simCloseAt: ms.optional(),
    simOpenAt: ms.optional(),
    simStartClosed: z.boolean().optional(),
    simStartOpen: z.boolean().optional(),
    connections: z
      .custom<Connections<string>>()
      .pipe(z.record(z.string(), connectionTarget))
      .optional(),
  })
```

### symbol

```typescript
export interface SymbolProps {
  originalFacingDirection?: "up" | "down" | "left" | "right"
  width?: string | number
  height?: string | number
  name?: string
}
/**
   * The facing direction that the symbol is designed for. If you set this to "right",
   * then it means the children were intended to represent the symbol facing right.
   * Generally, you shouldn't set this except where it can help prevent confusion
   * because you have a complex symbol. Default is "right" and this is most intuitive.
   */
export const symbolProps = z.object({
  originalFacingDirection: z
    .enum(["up", "down", "left", "right"])
    .default("right")
    .optional(),
  width: distance.optional(),
  height: distance.optional(),
  name: z.string().optional(),
})
```

### testpoint

```typescript
export type TestpointPinLabels = (typeof testpointPins)[number]

const testpointConnectionsProp = z
  .object({
    pin1: connectionTarget,
  })
export interface TestpointProps extends CommonComponentProps {
  footprintVariant?: "pad" | "through_hole"
  padShape?: "rect" | "circle"
  padDiameter?: number | string
  holeDiameter?: number | string
  width?: number | string
  height?: number | string
  connections?: TestpointConnections
}
.extend({
    connections: testpointConnectionsProp.optional(),
    footprintVariant: z.enum(["pad", "through_hole"]).optional(),
    padShape: z.enum(["rect", "circle"]).optional().default("circle"),
    padDiameter: distance.optional(),
    holeDiameter: distance.optional(),
    width: distance.optional(),
    height: distance.optional(),
  })
```

### toolingrail

```typescript
export interface ToolingrailProps {
  children?: any
}
export const toolingrailProps = z.object({
  children: z.any().optional(),
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
export const transistorPinsLabels = [
  "pin1",
  "pin2",
  "pin3",
  "emitter",
  "collector",
  "base",
  "gate",
  "source",
  "drain",
] as const
export interface TransistorProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  type: "npn" | "pnp" | "bjt" | "jfet" | "mosfet" | "igbt"
  connections?: Connections<transistorPinsLabels>
}
export const transistorProps = commonComponentProps.extend({
  type: z.enum(["npn", "pnp", "bjt", "jfet", "mosfet", "igbt"]),
  connections: createConnectionsProp(transistorPinsLabels).optional(),
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
  holeDiameter?: number | string
  outerDiameter?: number | string
  connectsTo?: string | string[]
  netIsAssignable?: boolean
}
export const viaProps = commonLayoutProps.extend({
  name: z.string().optional(),
  fromLayer: layer_ref,
  toLayer: layer_ref,
  holeDiameter: distance.optional(),
  outerDiameter: distance.optional(),
  connectsTo: z.string().or(z.array(z.string())).optional(),
  netIsAssignable: z.boolean().optional(),
})
```

### voltageprobe

```typescript
export interface VoltageProbeProps extends Omit<CommonComponentProps, "name"> {
  name?: string
  connectsTo: string
  referenceTo?: string
  color?: string
}
export const voltageProbeProps = commonComponentProps
  .omit({ name: true })
  .extend({
    name: z.string().optional(),
    connectsTo: z.string(),
    referenceTo: z.string().optional(),
    color: z.string().optional(),
  })
```

### voltagesource

```typescript
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
export const voltageSourceProps = commonComponentProps.extend({
  voltage: voltage.optional(),
  frequency: frequency.optional(),
  peakToPeakVoltage: voltage.optional(),
  waveShape: z.enum(["sinewave", "square", "triangle", "sawtooth"]).optional(),
  phase: rotation.optional(),
  dutyCycle: percentage.optional(),
  connections: createConnectionsProp(voltageSourcePinLabels).optional(),
})
```

