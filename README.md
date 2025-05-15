# @tscircuit/props

This repo contains all the prop definitions and zod parsers for tscircuit builtin components, e.g. `<resistor />`, `<diode />`,
`<capacitor />` etc.

This repo is the source-of-truth for defining the React props, API changes begin here. The focus of the API is on ergonomics for
the user (unlike [circuit-json](https://github.com/tscircuit/circuit-json) which focuses on ergonomics for a renderer)

```ts
import type { ResistorProps, ResistorPropsInput } from "@tscircuit/props"
import { resistorProps } from "@tscircuit/props"

resistorProps.parse({ resistance: "10k" } as ResistorPropsInput)
// { resistance: 10_000 }
```

<!-- COMPONENT_TABLE_START -->
## Available Components

| Component | Props Interface |
| --------- | -------------- |
| `<battery />` | [`BatteryProps`](https://github.com/tscircuit/props/blob/main/lib/components/battery.ts) |
| `<board />` | [`BoardProps`](https://github.com/tscircuit/props/blob/main/lib/components/board.ts) |
| `<capacitor />` | [`CapacitorProps`](https://github.com/tscircuit/props/blob/main/lib/components/capacitor.ts) |
| `<chip />` | [`ChipProps`](https://github.com/tscircuit/props/blob/main/lib/components/chip.ts) |
| `<constrainedlayout />` | [`ConstrainedLayoutProps`](https://github.com/tscircuit/props/blob/main/lib/components/constrainedlayout.ts) |
| `<crystal />` | [`CrystalProps`](https://github.com/tscircuit/props/blob/main/lib/components/crystal.ts) |
| `<diode />` | [`DiodeProps`](https://github.com/tscircuit/props/blob/main/lib/components/diode.ts) |
| `<footprint />` | [`FootprintProps`](https://github.com/tscircuit/props/blob/main/lib/components/footprint.ts) |
| `<group />` | [`BaseGroupProps`](https://github.com/tscircuit/props/blob/main/lib/components/group.ts) |
| `<hole />` | [`HoleProps`](https://github.com/tscircuit/props/blob/main/lib/components/hole.ts) |
| `<jumper />` | [`JumperProps`](https://github.com/tscircuit/props/blob/main/lib/components/jumper.ts) |
| `<mosfet />` | [`MosfetProps`](https://github.com/tscircuit/props/blob/main/lib/components/mosfet.ts) |
| `<net />` | [`NetProps`](https://github.com/tscircuit/props/blob/main/lib/components/net.ts) |
| `<netalias />` | [`NetAliasProps`](https://github.com/tscircuit/props/blob/main/lib/components/netalias.ts) |
| `<pinheader />` | [`PinHeaderProps`](https://github.com/tscircuit/props/blob/main/lib/components/pin-header.ts) |
| `<platedhole />` | [`CirclePlatedHoleProps`](https://github.com/tscircuit/props/blob/main/lib/components/platedhole.ts) |
| `<potentiometer />` | [`PotentiometerProps`](https://github.com/tscircuit/props/blob/main/lib/components/potentiometer.ts) |
| `<resistor />` | [`ResistorProps`](https://github.com/tscircuit/props/blob/main/lib/components/resistor.ts) |
| `<resonator />` | [`ResonatorProps`](https://github.com/tscircuit/props/blob/main/lib/components/resonator.ts) |
| `<smtpad />` | [`RectSmtPadProps`](https://github.com/tscircuit/props/blob/main/lib/components/smtpad.ts) |
| `<solderpaste />` | [`RectSolderPasteProps`](https://github.com/tscircuit/props/blob/main/lib/components/solderpaste.ts) |
| `<stampboard />` | [`StampboardProps`](https://github.com/tscircuit/props/blob/main/lib/components/stampboard.ts) |
| `<switch />` | [`SwitchProps`](https://github.com/tscircuit/props/blob/main/lib/components/switch.ts) |
| `<transistor />` | [`TransistorProps`](https://github.com/tscircuit/props/blob/main/lib/components/transistor.ts) |
<!-- COMPONENT_TABLE_END -->

<!-- USAGE_EXAMPLES_START -->
## Usage Examples

```tsx
import { resistorProps, type ResistorProps } from "@tscircuit/props"

// Validate component props
const validatedProps = resistorProps.parse({ resistance: "10k" })
// { resistance: 10000 }

// Type safety
const myResistor: ResistorProps = {
  name: "R1",
  resistance: 10000,
  footprint: "0805"
}
```
<!-- USAGE_EXAMPLES_END -->

<!-- INTERFACE_DEFINITIONS_START -->
## Component Interface Definitions

Below are the TypeScript interface definitions for all component props:


### BatteryProps

```ts
export interface BatteryProps extends CommonComponentProps {
  capacity?: number | string
}
```


### BoardProps

```ts
export interface BoardProps extends Omit<SubcircuitGroupProps, "subcircuit"> {
  width?: number | string
  height?: number | string
  outline?: Point[]
  outlineOffsetX?: number | string
  outlineOffsetY?: number | string
  material?: "fr4" | "fr1"
}
```


### CapacitorProps

```ts
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
```


### ChipProps

```ts
export interface ChipPropsSU<PinLabel extends string = string>
  extends CommonComponentProps {
  manufacturerPartNumber?: string
  pinLabels?: PinLabelsProp<string, PinLabel>
  schPinArrangement?: SchematicPortArrangement
  /** @deprecated Use schPinArrangement instead. */
  schPortArrangement?: SchematicPortArrangement
  schPinStyle?: SchematicPinStyle
  schPinSpacing?: Distance
  schWidth?: Distance
  schHeight?: Distance
  noSchematicRepresentation?: boolean
  internallyConnectedPins?: string[][]
  externallyConnectedPins?: string[][]
  connections?: Connections<PinLabel>
}
```


### ConstrainedLayoutProps

```ts
export interface ConstrainedLayoutProps {
  name?: string
  pcbOnly?: boolean
  schOnly?: boolean
}
```


### CrystalProps

```ts
export interface CrystalProps extends CommonComponentProps {
  frequency: number | string
  loadCapacitance: number | string
  pinVariant?: PinVariant
}
```


### DiodeProps

```ts
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
```


### FootprintProps

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
  originalLayer?: LayerRef
}
```


### BaseGroupProps

```ts
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
```


### HoleProps

```ts
export interface HoleProps extends Omit<PcbLayoutProps, "pcbRotation"> {
  name?: string
  diameter?: Distance
  radius?: Distance
}
```


### JumperProps

```ts
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
```


### MosfetProps

```ts
export interface MosfetProps extends CommonComponentProps {
  channelType: "n" | "p"
  mosfetMode: "enhancement" | "depletion"
}
```


### NetProps

```ts
export interface NetProps {
  name: string
}
```


### NetAliasProps

```ts
export interface NetAliasProps {
  net?: string
  schX?: number | string
  schY?: number | string
  schRotation?: number | string
  anchorSide?: "left" | "up" | "right" | "down"
}
```


### PinHeaderProps

```ts
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
}
```


### CirclePlatedHoleProps

```ts
export interface CirclePlatedHoleProps
  extends Omit<PcbLayoutProps, "pcbRotation" | "layer"> {
  name?: string
  shape: "circle"
  holeDiameter: number | string
  outerDiameter: number | string
  portHints?: PortHints
}
```


### PotentiometerProps

```ts
export interface PotentiometerProps extends CommonComponentProps {
  maxResistance: number | string
  pinVariant?: PotentiometerPinVariant
}
```


### ResistorProps

```ts
export interface ResistorProps extends CommonComponentProps {
  resistance: number | string
  pullupFor?: string
  pullupTo?: string
  pulldownFor?: string
  pulldownTo?: string
  connections?: Connections<ResistorPinLabels>
}
```


### ResonatorProps

```ts
export interface ResonatorProps extends CommonComponentProps {
  frequency: number | string
  loadCapacitance: number | string
  pinVariant?: ResonatorPinVariant
}
```


### RectSmtPadProps

```ts
export interface RectSmtPadProps extends Omit<PcbLayoutProps, "pcbRotation"> {
  shape: "rect"
  width: Distance
  height: Distance
  portHints?: PortHints
}
```


### RectSolderPasteProps

```ts
export interface RectSolderPasteProps
  extends Omit<PcbLayoutProps, "pcbRotation"> {
  shape: "rect"
  width: Distance
  height: Distance
}
```


### StampboardProps

```ts
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
```


### SwitchProps

```ts
export interface SwitchProps extends CommonComponentProps {
  type?: "spst" | "spdt" | "dpst" | "dpdt"
  isNormallyClosed?: boolean
  spdt?: boolean
  spst?: boolean
  dpst?: boolean
  dpdt?: boolean
}
```


### TransistorProps

```ts
export interface TransistorProps extends CommonComponentProps {
  type: "npn" | "pnp" | "bjt" | "jfet" | "mosfet"
}
```

<!-- INTERFACE_DEFINITIONS_END -->
