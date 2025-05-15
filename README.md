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

| Component | Props Interface | Props Input |
| --------- | -------------- | ----------- |
| `<battery />` | `BatteryProps` | `BatteryPropsInput` |
| `<board />` | `BoardProps` | `BoardPropsInput` |
| `<capacitor />` | `CapacitorProps` | `CapacitorPropsInput` |
| `<chip />` | `ChipProps` | `ChipPropsInput` |
| `<constrainedlayout />` | `ConstrainedLayoutProps` | `ConstrainedLayoutPropsInput` |
| `<crystal />` | `CrystalProps` | `CrystalPropsInput` |
| `<diode />` | `DiodeProps` | `DiodePropsInput` |
| `<footprint />` | `FootprintProps` | `FootprintPropsInput` |
| `<group />` | `BaseGroupProps` | `BaseGroupPropsInput` |
| `<hole />` | `HoleProps` | `HolePropsInput` |
| `<jumper />` | `JumperProps` | `JumperPropsInput` |
| `<mosfet />` | `MosfetProps` | `MosfetPropsInput` |
| `<net />` | `NetProps` | `NetPropsInput` |
| `<netalias />` | `NetAliasProps` | `NetAliasPropsInput` |
| `<pinheader />` | `PinHeaderProps` | `PinHeaderPropsInput` |
| `<platedhole />` | `CirclePlatedHoleProps` | `CirclePlatedHolePropsInput` |
| `<potentiometer />` | `PotentiometerProps` | `PotentiometerPropsInput` |
| `<resistor />` | `ResistorProps` | `ResistorPropsInput` |
| `<resonator />` | `ResonatorProps` | `ResonatorPropsInput` |
| `<smtpad />` | `RectSmtPadProps` | `RectSmtPadPropsInput` |
| `<solderpaste />` | `RectSolderPasteProps` | `RectSolderPastePropsInput` |
| `<stampboard />` | `StampboardProps` | `StampboardPropsInput` |
| `<switch />` | `SwitchProps` | `SwitchPropsInput` |
| `<transistor />` | `TransistorProps` | `TransistorPropsInput` |
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
