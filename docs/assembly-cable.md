# Assembly cables

`AssemblyCableProps` describes a cable between two assembly endpoints. Its
validator is exported as `assemblyCableProps` and `assemblyProps.cable`.

```tsx
<assembly.cable
  name="MOTOR_CABLE"
  from="MOTOR.wireside"
  to=".CONTROLLER > .J_MOTOR"
/>

<assembly.cable
  name="USB"
  standard="usb_c"
  from=".HOST > .J_USB"
  to=".CONTROLLER > .J_USB"
/>
```

| Prop       | Accepted input                   | Parsed output                        |
| ---------- | -------------------------------- | ------------------------------------ |
| `name`     | Required nonempty string         | Trimmed cable identity               |
| `from`     | Required nonempty string         | Trimmed start endpoint reference     |
| `to`       | Required nonempty string         | Trimmed end endpoint reference       |
| `standard` | Optional `"usb_c"` or `"adaptercable"` | Unchanged; omitted when not supplied |

Endpoints can be connector selectors or named assembly references. The initial
`usb_c` preset represents a USB-C-to-USB-C cable. Omitting `standard` leaves
cable selection to endpoint inference. Position, orientation, route, and length
are inferred; there are no corresponding props or aliases.

This is an additive props API and requires no migration. The schema validates
the inputs; endpoint resolution, routing, and rendering require support in core
and the CAD renderer.

## Physical connector models

Use a connector's `model` to describe its physical mating interface. `standard`
remains independent and can supply other connector behavior. Core preserves
model specifications as `modelprinter_string` in Circuit JSON and infers cable
ends from them. Known contact counts must match.

```tsx
<connector name="J1" model="bullet3_d3.5mm_gmale" footprint={fromFootprint} />
<connector name="J2" model="bullet3_d4mm_gmale" footprint={toFootprint} />
<assembly.cable name="ADAPTER" from=".J1" to=".J2" />
```

Imported CAD can expose named interfaces with a `model`, measured `position`
and outward `facingDirection`. Positions use model-local physical millimeters,
before the CAD's rotation and position offset.

```tsx
<assembly.subassembly name="MOTOR" cadModel={motorCad}
  cableConnectors={{ phases: {
    model: "bullet3_d3.5mm_gmale",
    position: { x: 3, y: 4, z: 32.25 }, facingDirection: "z+"
  } }} />
<assembly.cable name="ADAPTER" from="MOTOR.phases" to=".J2" />
```

Different ends compose with `adaptercable_a(CONNECTOR)_b(CONNECTOR)`, including
JST SH-to-PH and other supported interfaces. Each end keeps its native contact
pitch. Set `standard="adaptercable"` to request that wrapper explicitly; otherwise
core retains compatible shorthand for matching ends. Wire bundles stay compact
through the middle, with fanout near each connector.
