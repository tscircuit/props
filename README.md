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
