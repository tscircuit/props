# PCB return-current experiment props

`<simulation.pcbreturncurrentsimulation>` describes a pending experiment containing one or
more `<simulation.pcbreturncurrentexcitation>` elements. Core emits the corresponding
Circuit JSON definitions after the PCB routes exist. Rendering the TSX does not
run an EM solver.

```tsx
import { simulation } from "@tscircuit/core"

<simulation.pcbreturncurrentsimulation name="DDR D13 return path">
  <simulation.pcbreturncurrentexcitation
    name="D13"
    source=".U1 > .DDR_D13"
    load=".U2 > .DQ13"
    ground="net.GND"
    current="5mA"
    returnSource=".U2 > .GND"
    returnSink=".U1 > .GND"
    sourceImpedance="25ohm"
    loadImpedance="100ohm"
  />
</simulation.pcbreturncurrentsimulation>
```

The props package exports matching validators through `simulationProps`:

```ts
import { simulationProps } from "@tscircuit/props"

const experiment = simulationProps.pcbreturncurrentsimulation.parse({
  name: "DDR D13 return path",
})
```

`simulationProps.pcbreturncurrentexcitation` validates the nested excitation.
These namespace entries share the existing `pcbReturnCurrentSimulationProps`
and `pcbReturnCurrentExcitationProps` validators and TypeScript interfaces.

All five selectors and all three electrical values are required. The selected
ground pins must already connect to the selected ground net; these props do not
add traces, copper, or connections. For positive current, the signal flows from
`source` to `load`, then the return conductor carries current from the load-side
`returnSource` to the driver-side `returnSink`. These are separate ground
terminals, not points projected beneath the signal pins.

`current` accepts a finite positive peak amplitude. Raw numbers and bare numeric
strings are amperes; unit strings such as `5mA` and `250uA` are converted to
amperes. It is in phase with the excitation and is not RMS. `sourceImpedance` and
`loadImpedance` accept finite positive real resistance, in ohms for raw numbers
or bare numeric strings; `25ohm`, `100Ω`, and `1kΩ` are valid. Complex impedances,
tolerance strings, units from other dimensions, zero, and negative values are
rejected. No current, termination, or contact defaults are supplied.

Selectors are trimmed, nonempty strings. Optional `trace` selects a particular
trace when more than one route joins the signal pins. The initial core
implementation resolves return terminals to physical PCB ports/pads; selecting
a standalone via as a return terminal is unsupported. If a PCB port spans
multiple copper layers, `returnSourceLayer` or `returnSinkLayer` must identify
the contact layer. These props accept the standard Circuit JSON layer input,
such as `"top"`, `"inner1"`, or `{ name: "bottom" }`, and parse to its canonical
layer name. The core resolver validates that the selected port exists on that
layer.

The container's optional `name` is the experiment identity and readable name.
The excitation's optional `name` is used for diagnostics; the official
excitation schema has no name field. Its Circuit JSON record identifies the
experiment, trace, ground net, return contacts, and source/load terminal pairs.

Frequency, stackup, mesh size, and sampling cell size are run options for the
simulation CLI. They are not props because the current Circuit JSON pending
experiment schema cannot store them. Supply them when running the emitted
definitions, for example `--frequency-hz 100000000 --cell-size 0.05`. No solver
or run parameters are inferred by TSX rendering.

Core also accepts the flat `<pcbreturncurrentsimulation>` and
`<pcbreturncurrentexcitation>` forms with identical props. This is a new props
API with no property aliases or migration requirements. Unknown props are
rejected, including unsupported run settings and the CLI's `sourceReference`
and `loadReference` names. Existing analog simulation and component props keep
their existing behavior.
