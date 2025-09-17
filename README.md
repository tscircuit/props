# @tscircuit/props

This repo contains all the prop definitions and zod parsers for tscircuit builtin components, e.g. `<resistor />`, `<diode />`,
`<capacitor />` etc.

This repo is the source-of-truth for defining the React props, API changes begin here. The focus of the API is on ergonomics for
the user (unlike [circuit-json](https://github.com/tscircuit/circuit-json) which focuses on ergonomics for a renderer)

```ts
import type { ResistorProps, ResistorPropsInput } from "@tscircuit/props";
import { resistorProps } from "@tscircuit/props";

resistorProps.parse({ resistance: "10k" } as ResistorPropsInput);
// { resistance: 10_000 }
```

<!-- COMPONENT_TABLE_START -->

## Available Components

| Component               | Props Interface                                                       |
| ----------------------- | --------------------------------------------------------------------- |
| `<battery />`           | [`BatteryProps`](#batteryprops-battery)                               |
| `<board />`             | [`BoardProps`](#boardprops-board)                                     |
| `<breakout />`          | [`BreakoutProps`](#breakoutprops-breakout)                            |
| `<breakoutpoint />`     | [`BreakoutPointProps`](#breakoutpointprops-breakoutpoint)             |
| `<cadassembly />`       | [`CadAssemblyProps`](#cadassemblyprops-cadassembly)                   |
| `<cadmodel />`          | [`CadModelProps`](#cadmodelprops-cadmodel)                            |
| `<capacitor />`         | [`CapacitorProps`](#capacitorprops-capacitor)                         |
| `<chip />`              | [`ChipProps`](#chipprops-chip)                                        |
| `<connector />`         | [`ConnectorProps`](#connectorprops-connector)                         |
| `<constrainedlayout />` | [`ConstrainedLayoutProps`](#constrainedlayoutprops-constrainedlayout) |
| `<copperpour />`        | [`CopperPourProps`](#copperpourprops-copperpour)                      |
| `<crystal />`           | [`CrystalProps`](#crystalprops-crystal)                               |
| `<cutout />`            | [`RectCutoutProps`](#rectcutoutprops-cutout)                          |
| `<diode />`             | [`DiodeProps`](#diodeprops-diode)                                     |
| `<footprint />`         | [`FootprintProps`](#footprintprops-footprint)                         |
| `<fuse />`              | [`FuseProps`](#fuseprops-fuse)                                        |
| `<group />`             | [`BaseGroupProps`](#basegroupprops-group)                             |
| `<hole />`              | [`CircleHoleProps`](#circleholeprops-hole)                            |
| `<inductor />`          | [`InductorProps`](#inductorprops-inductor)                            |
| `<jumper />`            | [`JumperProps`](#jumperprops-jumper)                                  |
| `<mosfet />`            | [`MosfetProps`](#mosfetprops-mosfet)                                  |
| `<net />`               | [`NetProps`](#netprops-net)                                           |
| `<netalias />`          | [`NetAliasProps`](#netaliasprops-netalias)                            |
| `<netlabel />`          | [`NetLabelProps`](#netlabelprops-netlabel)                            |
| `<pinheader />`         | [`PinHeaderProps`](#pinheaderprops-pinheader)                         |
| `<pinout />`            | [`PinoutProps`](#pinoutprops-pinout)                                  |
| `<platedhole />`        | [`CirclePlatedHoleProps`](#circleplatedholeprops-platedhole)          |
| `<potentiometer />`     | [`PotentiometerProps`](#potentiometerprops-potentiometer)             |
| `<resistor />`          | [`ResistorProps`](#resistorprops-resistor)                            |
| `<resonator />`         | [`ResonatorProps`](#resonatorprops-resonator)                         |
| `<schematiccell />`     | [`SchematicCellProps`](#schematiccellprops-schematiccell)             |
| `<schematicrow />`      | [`SchematicRowProps`](#schematicrowprops-schematicrow)                |
| `<schematictable />`    | [`SchematicTableProps`](#schematictableprops-schematictable)          |
| `<smtpad />`            | [`RectSmtPadProps`](#rectsmtpadprops-smtpad)                          |
| `<solderjumper />`      | [`SolderJumperProps`](#solderjumperprops-solderjumper)                |
| `<solderpaste />`       | [`RectSolderPasteProps`](#rectsolderpasteprops-solderpaste)           |
| `<stampboard />`        | [`StampboardProps`](#stampboardprops-stampboard)                      |
| `<switch />`            | [`SwitchProps`](#switchprops-switch)                                  |
| `<symbol />`            | [`SymbolProps`](#symbolprops-symbol)                                  |
| `<testpoint />`         | [`TestpointProps`](#testpointprops-testpoint)                         |
| `<transistor />`        | [`TransistorProps`](#transistorprops-transistor)                      |
| `<via />`               | [`ViaProps`](#viaprops-via)                                           |
| `<voltagesource />`     | [`VoltageSourceProps`](#voltagesourceprops-voltagesource)             |

<!-- COMPONENT_TABLE_END -->

<!-- USAGE_EXAMPLES_START -->

## Usage Examples

```tsx
import { resistorProps, type ResistorProps } from "@tscircuit/props";

// Validate component props
const validatedProps = resistorProps.parse({ resistance: "10k" });
// { resistance: 10000 }

// Type safety
const myResistor: ResistorProps = {
  name: "R1",
  resistance: 10000,
  footprint: "0805",
};
```

<!-- USAGE_EXAMPLES_END -->

<!-- INTERFACE_DEFINITIONS_START -->

## Component Interface Definitions

Below are the TypeScript interface definitions for all component props:

### CommonComponentProps

```ts
export interface CommonComponentProps extends CommonLayoutProps {
  key?: any;
  name: string;
  pinAttributes?: Record<PinLabel, PinAttributeMap>;
  supplierPartNumbers?: SupplierPartNumbers;
  cadModel?: CadModelProp;
  children?: any;
  symbolName?: string;
  doNotPlace?: boolean;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/common/layout.ts)

### SubcircuitGroupProps

```ts
export interface SubcircuitGroupProps extends BaseGroupProps {
  manualEdits?: ManualEditsFileInput;
  routingDisabled?: boolean;
  defaultTraceWidth?: Distance;
  minTraceWidth?: Distance;
  pcbRouteCache?: PcbRouteCache;

  autorouter?: AutorouterProp;

  /**
   * If true, we'll automatically layout the schematic for this group. Must be
   * a subcircuit (currently). This is eventually going to be replaced with more
   * sophisticated layout options/modes and will be enabled by default.
   */
  schAutoLayoutEnabled?: boolean;

  /**
   * If true, net labels will automatically be created for complex traces
   */
  schTraceAutoLabelEnabled?: boolean;

  /** Maximum length a trace can span on the schematic */
  schMaxTraceDistance?: Distance;

  partsEngine?: PartsEngine;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/group.ts)

### BatteryProps `<battery />`

```ts
export interface BatteryProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  capacity?: number | string;
  voltage?: number | string;
  standard?: "AA" | "AAA" | "9V" | "CR2032" | "18650" | "C";
  schOrientation?: SchematicOrientation;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/battery.ts)

### BoardProps `<board />`

```ts
export interface BoardProps extends Omit<SubcircuitGroupProps, "subcircuit"> {
  material?: "fr4" | "fr1";
  /** Number of layers for the PCB */
  layers?: 2 | 4;
  borderRadius?: Distance;
  boardAnchorPosition?: Point;
  boardAnchorAlignment?: z.infer<typeof ninePointAnchor>;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/board.ts)

### BreakoutProps `<breakout />`

```ts
export interface BreakoutProps
  extends Omit<SubcircuitGroupProps, "subcircuit"> {
  padding?: Distance;
  paddingLeft?: Distance;
  paddingRight?: Distance;
  paddingTop?: Distance;
  paddingBottom?: Distance;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/breakout.ts)

### BreakoutPointProps `<breakoutpoint />`

```ts
export interface BreakoutPointProps
  extends Omit<PcbLayoutProps, "pcbRotation" | "layer"> {
  connection: string;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/breakoutpoint.ts)

### CadAssemblyProps `<cadassembly />`

```ts
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
  originalLayer?: LayerRef;

  children?: any;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/cadassembly.ts)

### CadModelProps `<cadmodel />`

```ts
export interface CadModelProps extends CadModelBase {
  modelUrl: string;
  pcbX?: Distance;
  pcbY?: Distance;
  pcbZ?: Distance;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/cadmodel.ts)

### CapacitorProps `<capacitor />`

```ts
export interface CapacitorProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  capacitance: number | string;
  maxVoltageRating?: number | string;
  schShowRatings?: boolean;
  polarized?: boolean;
  decouplingFor?: string;
  decouplingTo?: string;
  bypassFor?: string;
  bypassTo?: string;
  maxDecouplingTraceLength?: number;
  schOrientation?: SchematicOrientation;
  connections?: Connections<CapacitorPinLabels>;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/capacitor.ts)

### ChipProps `<chip />`

```ts
export interface ChipPropsSU<
  PinLabel extends SchematicPinLabel = SchematicPinLabel,
> extends CommonComponentProps<PinLabel> {
  manufacturerPartNumber?: string;
  pinLabels?: PinLabelsProp<SchematicPinLabel, PinLabel>;
  /**
   * Whether to show pin aliases in the schematic
   */
  showPinAliases?: boolean;
  /**
   * Labels for PCB pins
   */
  pcbPinLabels?: Record<string, string>;
  schPinArrangement?: SchematicPortArrangement;
  /** @deprecated Use schPinArrangement instead. */
  schPortArrangement?: SchematicPortArrangement;
  pinCompatibleVariants?: PinCompatibleVariant[];
  schPinStyle?: SchematicPinStyle;
  schPinSpacing?: Distance;
  schWidth?: Distance;
  schHeight?: Distance;
  noSchematicRepresentation?: boolean;
  internallyConnectedPins?: (string | number)[][];
  externallyConnectedPins?: string[][];
  connections?: Connections<PinLabel>;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/chip.ts)

### ConnectorProps `<connector />`

```ts
export interface ConnectorProps extends CommonComponentProps {
  manufacturerPartNumber?: string;
  pinLabels?: Record<
    number | SchematicPinLabel,
    SchematicPinLabel | SchematicPinLabel[]
  >;
  schPinStyle?: SchematicPinStyle;
  schPinSpacing?: number | string;
  schWidth?: number | string;
  schHeight?: number | string;
  schDirection?: "left" | "right";
  schPortArrangement?: SchematicPortArrangement;
  /**
   * Groups of pins that are internally connected
   * e.g., [["1","2"], ["2","3"]]
   */
  internallyConnectedPins?: (string | number)[][];
  /**
   * Connector standard, e.g. usb_c, m2
   */
  standard?: "usb_c" | "m2";
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/connector.ts)

### ConstrainedLayoutProps `<constrainedlayout />`

```ts
export interface ConstrainedLayoutProps {
  name?: string;
  pcbOnly?: boolean;
  schOnly?: boolean;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/constrainedlayout.ts)

### CopperPourProps `<copperpour />`

```ts
export interface CopperPourProps {
  name?: string;
  layer: LayerRefInput;
  connectsTo: string;
  padMargin?: Distance;
  traceMargin?: Distance;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/copper-pour.ts)

### CrystalProps `<crystal />`

```ts
export interface CrystalProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  frequency: number | string;
  loadCapacitance: number | string;
  manufacturerPartNumber?: string;
  mpn?: string;
  pinVariant?: PinVariant;
  schOrientation?: SchematicOrientation;
  connections?: Connections<CrystalPinLabels>;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/crystal.ts)

### RectCutoutProps `<cutout />`

```ts
export interface RectCutoutProps
  extends Omit<PcbLayoutProps, "layer" | "pcbRotation"> {
  name?: string;
  shape: "rect";
  width: Distance;
  height: Distance;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/cutout.ts)

### DiodeProps `<diode />`

```ts
export interface DiodeProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  connections?: {
    anode?: string | string[] | readonly string[];
    cathode?: string | string[] | readonly string[];
    pin1?: string | string[] | readonly string[];
    pin2?: string | string[] | readonly string[];
    pos?: string | string[] | readonly string[];
    neg?: string | string[] | readonly string[];
  };
  variant?: "standard" | "schottky" | "zener" | "avalanche" | "photo" | "tvs";
  standard?: boolean;
  schottky?: boolean;
  zener?: boolean;
  avalanche?: boolean;
  photo?: boolean;
  tvs?: boolean;
  schOrientation?: SchematicOrientation;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/diode.ts)

### FootprintProps `<footprint />`

```ts
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
  originalLayer?: LayerRef;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/footprint.ts)

### FuseProps `<fuse />`

```ts
export interface FuseProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  /**
   * Current rating of the fuse in amperes
   */
  currentRating: number | string;

  /**
   * Voltage rating of the fuse
   */
  voltageRating?: number | string;

  /**
   * Whether to show ratings on schematic
   */
  schShowRatings?: boolean;

  schOrientation?: SchematicOrientation;

  /**
   * Connections to other components
   */
  connections?: Connections<PinLabel>;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/fuse.ts)

### BaseGroupProps

```ts
export interface BaseGroupProps extends CommonLayoutProps, LayoutConfig {
  name?: string;
  key?: any;
  children?: any;

  /**
   * Title to display above this group in the schematic view
   */
  schTitle?: string;

  /**
   * If true, render this group as a single schematic box
   */
  showAsSchematicBox?: boolean;

  /**
   * Mapping of external pin names to internal connection targets
   */
  connections?: Connections;

  /**
   * Arrangement for pins when rendered as a schematic box
   */
  schPinArrangement?: SchematicPinArrangement;

  pcbWidth?: Distance;
  pcbHeight?: Distance;
  schWidth?: Distance;
  schHeight?: Distance;

  pcbLayout?: LayoutConfig;
  schLayout?: LayoutConfig;
  cellBorder?: Border | null;
  border?: Border | null;
  schPadding?: Distance;
  schPaddingLeft?: Distance;
  schPaddingRight?: Distance;
  schPaddingTop?: Distance;
  schPaddingBottom?: Distance;

  pcbPadding?: Distance;
  pcbPaddingLeft?: Distance;
  pcbPaddingRight?: Distance;
  pcbPaddingTop?: Distance;
  pcbPaddingBottom?: Distance;

  /** @deprecated Use `pcbGrid` */
  grid?: boolean;
  /** @deprecated Use `pcbFlex` */
  flex?: boolean | string;

  pcbGrid?: boolean;
  pcbGridCols?: number | string;
  pcbGridRows?: number | string;
  pcbGridTemplateRows?: string;
  pcbGridTemplateColumns?: string;
  pcbGridTemplate?: string;
  pcbGridGap?: number | string;
  pcbGridRowGap?: number | string;
  pcbGridColumnGap?: number | string;

  pcbFlex?: boolean | string;
  pcbFlexGap?: number | string;
  pcbFlexDirection?: "row" | "column";
  pcbAlignItems?: "start" | "center" | "end" | "stretch";
  pcbJustifyContent?:
    | "start"
    | "center"
    | "end"
    | "stretch"
    | "space-between"
    | "space-around"
    | "space-evenly";
  pcbFlexRow?: boolean;
  pcbFlexColumn?: boolean;
  pcbGap?: number | string;
  pcbPack?: boolean;
  pcbPackGap?: number | string;

  schGrid?: boolean;
  schGridCols?: number | string;
  schGridRows?: number | string;
  schGridTemplateRows?: string;
  schGridTemplateColumns?: string;
  schGridTemplate?: string;
  schGridGap?: number | string;
  schGridRowGap?: number | string;
  schGridColumnGap?: number | string;

  schFlex?: boolean | string;
  schFlexGap?: number | string;
  schFlexDirection?: "row" | "column";
  schAlignItems?: "start" | "center" | "end" | "stretch";
  schJustifyContent?:
    | "start"
    | "center"
    | "end"
    | "stretch"
    | "space-between"
    | "space-around"
    | "space-evenly";
  schFlexRow?: boolean;
  schFlexColumn?: boolean;
  schGap?: number | string;
  schPack?: boolean;
  schMatchAdapt?: boolean;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/group.ts)

### CircleHoleProps `<hole />`

```ts
export interface CircleHoleProps extends PcbLayoutProps {
  name?: string;
  shape?: "circle";
  diameter?: Distance;
  radius?: Distance;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/hole.ts)

### InductorProps `<inductor />`

```ts
export interface InductorProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  inductance: number | string;
  maxCurrentRating?: number | string;
  schOrientation?: SchematicOrientation;
  connections?: Connections<InductorPinLabels>;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/inductor.ts)

### JumperProps `<jumper />`

```ts
export interface JumperProps extends CommonComponentProps {
  manufacturerPartNumber?: string;
  pinLabels?: Record<
    number | SchematicPinLabel,
    SchematicPinLabel | SchematicPinLabel[]
  >;
  schPinStyle?: SchematicPinStyle;
  schPinSpacing?: number | string;
  schWidth?: number | string;
  schHeight?: number | string;
  schDirection?: "left" | "right";
  schPinArrangement?: SchematicPortArrangement;
  /**
   * @deprecated Use schPinArrangement instead.
   */
  schPortArrangement?: SchematicPortArrangement;
  /**
   * Labels for PCB pins
   */
  pcbPinLabels?: Record<string, string>;
  /**
   * Number of pins on the jumper (2 or 3)
   */
  pinCount?: 2 | 3;
  /**
   * Groups of pins that are internally connected
   * e.g., [["1","2"], ["2","3"]]
   */
  internallyConnectedPins?: (string | number)[][];
  /**
   * Connections to other components
   */
  connections?: Connections<string>;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/jumper.ts)

### MosfetProps `<mosfet />`

```ts
export interface MosfetProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  channelType: "n" | "p";
  mosfetMode: "enhancement" | "depletion";
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/mosfet.ts)

### NetProps `<net />`

```ts
export interface NetProps {
  name: string;
  connectsTo?: string | string[];
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/net.ts)

### NetAliasProps `<netalias />`

```ts
export interface NetAliasProps {
  net?: string;
  connection?: string;
  schX?: number | string;
  schY?: number | string;
  schRotation?: number | string;
  anchorSide?: "left" | "top" | "right" | "bottom";
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/netalias.ts)

### NetLabelProps `<netlabel />`

```ts
export interface NetLabelProps {
  net?: string;
  connection?: string;
  connectsTo?: string | string[];
  schX?: number | string;
  schY?: number | string;
  schRotation?: number | string;
  anchorSide?: "left" | "top" | "right" | "bottom";
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/netlabel.ts)

### PinHeaderProps `<pinheader />`

```ts
export interface PinHeaderProps extends CommonComponentProps {
  /**
   * Number of pins in the header
   */
  pinCount: number;

  /**
   * Distance between pins
   */
  pitch?: number | string;

  /**
   * Schematic facing direction
   */
  schFacingDirection?: "up" | "down" | "left" | "right";

  /**
   * Whether the header is male, female, or unpopulated
   */
  gender?: "male" | "female" | "unpopulated";

  /**
   * Whether to show pin labels in silkscreen
   */
  showSilkscreenPinLabels?: boolean;

  /**
   * Labels for PCB pins
   */
  pcbPinLabels?: Record<string, string>;

  /**
   * Whether the header has two rows of pins
   */
  doubleRow?: boolean;

  /**
   * If true, the header is a right-angle style connector
   */
  rightAngle?: boolean;

  /**
   * Orientation of the header on the PCB
   */
  pcbOrientation?: PcbOrientation;

  /**
   * Diameter of the through-hole for each pin
   */
  holeDiameter?: number | string;

  /**
   * Diameter of the plated area around each hole
   */
  platedDiameter?: number | string;

  /**
   * Labels for each pin
   */
  pinLabels?: Record<string, SchematicPinLabel> | SchematicPinLabel[];

  /**
   * Connections to other components
   */
  connections?: Connections<string>;

  /**
   * Direction the header is facing
   */
  facingDirection?: "left" | "right";

  /**
   * Pin arrangement in schematic view
   */
  schPinArrangement?: SchematicPinArrangement;

  /**
   * Schematic pin style (margins, etc)
   */
  schPinStyle?: SchematicPinStyle;

  /**
   * Schematic pin spacing
   */
  schPinSpacing?: number | string;

  /**
   * Schematic width
   */
  schWidth?: number | string;

  /**
   * Schematic height
   */
  schHeight?: number | string;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/pin-header.ts)

### CirclePlatedHoleProps `<platedhole />`

```ts
export interface CirclePlatedHoleProps
  extends Omit<PcbLayoutProps, "pcbRotation" | "layer"> {
  name?: string;
  connectsTo?: string | string[];
  shape: "circle";
  holeDiameter: number | string;
  outerDiameter: number | string;
  portHints?: PortHints;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/platedhole.ts)

### PotentiometerProps `<potentiometer />`

```ts
export interface PotentiometerProps extends CommonComponentProps {
  maxResistance: number | string;
  pinVariant?: PotentiometerPinVariant;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/potentiometer.ts)

### ResistorProps `<resistor />`

```ts
export interface ResistorProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  resistance: number | string;
  pullupFor?: string;
  pullupTo?: string;
  pulldownFor?: string;
  pulldownTo?: string;
  schOrientation?: SchematicOrientation;
  connections?: Connections<ResistorPinLabels>;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/resistor.ts)

### ResonatorProps `<resonator />`

```ts
export interface ResonatorProps extends CommonComponentProps {
  frequency: number | string;
  loadCapacitance: number | string;
  pinVariant?: ResonatorPinVariant;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/resonator.ts)

### SchematicCellProps `<schematiccell />`

```ts
export interface SchematicCellProps {
  children?: string;
  horizontalAlign?: "left" | "center" | "right";
  verticalAlign?: "top" | "middle" | "bottom";
  fontSize?: number | string;
  rowSpan?: number;
  colSpan?: number;
  width?: number | string;
  text?: string;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/schematic-cell.ts)

### SchematicRowProps `<schematicrow />`

```ts
export interface SchematicRowProps {
  children?: any;
  height?: number | string;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/schematic-row.ts)

### SchematicTableProps `<schematictable />`

```ts
export interface SchematicTableProps {
  schX?: number | string;
  schY?: number | string;
  children?: any;
  cellPadding?: number | string;
  borderWidth?: number | string;
  anchor?: z.infer<typeof ninePointAnchor>;
  fontSize?: number | string;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/schematic-table.ts)

### RectSmtPadProps `<smtpad />`

```ts
export interface RectSmtPadProps extends Omit<PcbLayoutProps, "pcbRotation"> {
  name?: string;
  shape: "rect";
  width: Distance;
  height: Distance;
  rectBorderRadius?: Distance;
  portHints?: PortHints;
  coveredWithSolderMask?: boolean;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/smtpad.ts)

### SolderJumperProps `<solderjumper />`

```ts
export interface SolderJumperProps extends JumperProps {
  /**
   * Pins that are bridged with solder by default
   */
  bridgedPins?: string[][];
  /**
   * If true, all pins are connected with cuttable traces
   */
  bridged?: boolean;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/solderjumper.ts)

### RectSolderPasteProps `<solderpaste />`

```ts
export interface RectSolderPasteProps
  extends Omit<PcbLayoutProps, "pcbRotation"> {
  shape: "rect";
  width: Distance;
  height: Distance;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/solderpaste.ts)

### StampboardProps `<stampboard />`

```ts
export interface StampboardProps extends BoardProps {
  leftPinCount?: number;
  rightPinCount?: number;
  topPinCount?: number;
  bottomPinCount?: number;
  leftPins?: string[];
  rightPins?: string[];
  topPins?: string[];
  bottomPins?: string[];
  pinPitch?: number | string;
  innerHoles?: boolean;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/stampboard.ts)

### SwitchProps `<switch />`

```ts
export interface SwitchProps extends CommonComponentProps {
  type?: "spst" | "spdt" | "dpst" | "dpdt";
  isNormallyClosed?: boolean;
  spdt?: boolean;
  spst?: boolean;
  dpst?: boolean;
  dpdt?: boolean;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/switch.ts)

### SymbolProps `<symbol />`

```ts
export interface SymbolProps {
  /**
   * The facing direction that the symbol is designed for. If you set this to "right",
   * then it means the children were intended to represent the symbol facing right.
   * Generally, you shouldn't set this except where it can help prevent confusion
   * because you have a complex symbol. Default is "right" and this is most intuitive.
   */
  originalFacingDirection?: "up" | "down" | "left" | "right";
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/symbol.ts)

### TestpointProps `<testpoint />`

```ts
export interface TestpointProps extends CommonComponentProps {
  /**
   * The footprint variant of the testpoint either a surface pad or through-hole
   */
  footprintVariant?: "pad" | "through_hole";
  /**
   * The shape of the pad if using a pad variant
   */
  padShape?: "rect" | "circle";
  /**
   * Diameter of the copper pad (applies to both SMD pads and plated holes)
   */
  padDiameter?: number | string;
  /**
   * Diameter of the hole if using a through-hole testpoint
   */
  holeDiameter?: number | string;
  /**
   * Width of the pad when padShape is rect
   */
  width?: number | string;
  /**
   * Height of the pad when padShape is rect
   */
  height?: number | string;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/testpoint.ts)

### TransistorProps `<transistor />`

```ts
export interface TransistorProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  type: "npn" | "pnp" | "bjt" | "jfet" | "mosfet" | "igbt";
  connections?: Connections<transistorPinsLabels>;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/transistor.ts)

### ViaProps `<via />`

```ts
export interface ViaProps extends CommonLayoutProps {
  name?: string;
  fromLayer: LayerRefInput;
  toLayer: LayerRefInput;
  holeDiameter: number | string;
  outerDiameter: number | string;
  connectsTo?: string | string[];
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/via.ts)

### VoltageSourceProps `<voltagesource />`

```ts
export interface VoltageSourceProps<PinLabel extends string = string>
  extends CommonComponentProps<PinLabel> {
  voltage?: number | string;
  frequency?: number | string;
  peakToPeakVoltage?: number | string;
  waveShape?: WaveShape;
  phase?: number | string;
  dutyCycle?: number | string;
  connections?: Connections<VoltageSourcePinLabels>;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/components/voltagesource.ts)

<!-- INTERFACE_DEFINITIONS_END -->

<!-- PLATFORM_CONFIG_START -->

## tscircuit Platform Configuration

### PlatformConfig

```ts
export interface PlatformConfig {
  partsEngine?: PartsEngine;

  autorouter?: AutorouterProp;

  // TODO this follows a subset of the localStorage interface
  localCacheEngine?: any;

  registryApiUrl?: string;

  cloudAutorouterUrl?: string;

  projectName?: string;
  projectBaseUrl?: string;
  version?: string;
  url?: string;
  printBoardInformationToSilkscreen?: boolean;

  pcbDisabled?: boolean;
  schematicDisabled?: boolean;
  partsEngineDisabled?: boolean;

  footprintLibraryMap?: Record<
    string,
    | ((path: string) => Promise<FootprintLibraryResult>)
    | Record<
        string,
        any[] | ((path: string) => Promise<FootprintLibraryResult>)
      >
  >;

  footprintFileParserMap?: Record<string, FootprintFileParserEntry>;
}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/platformConfig.ts)

<!-- PLATFORM_CONFIG_END -->

<!-- PROJECT_CONFIG_START -->

## tscircuit Project Configuration

### ProjectConfig

```ts
export interface ProjectConfig
  extends Pick<
    PlatformConfig,
    | "projectName"
    | "projectBaseUrl"
    | "version"
    | "url"
    | "printBoardInformationToSilkscreen"
  > {}
```

[Source](https://github.com/tscircuit/props/blob/main/lib/projectConfig.ts)

<!-- PROJECT_CONFIG_END -->
