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

| Prop | Accepted input | Parsed output |
| --- | --- | --- |
| `name` | Required nonempty string | Trimmed cable identity |
| `from` | Required nonempty string | Trimmed start endpoint reference |
| `to` | Required nonempty string | Trimmed end endpoint reference |
| `standard` | Optional `"usb_c"` | Unchanged; omitted when not supplied |
| `waypoints` | Optional array of `{ x: number, y: number, z: number }` in mm; coordinates must be finite | Points preserved in order; no default |
| `waypointAnchor` | `"start"` or `"end"`; required with `waypoints` | Unchanged; no default |
| `waypointAxisOrientation` | `"board_at_start"` or `"board_at_end"`; required with `waypoints` | Unchanged; no default |

Endpoints can be connector selectors or named assembly references. The initial
`usb_c` preset represents a USB-C-to-USB-C cable. Omitting `standard` leaves
cable selection to endpoint inference. Omitting `waypoints` preserves automatic
routing.

This is an additive props API and requires no migration. The schema validates
the inputs; endpoint resolution, routing, and rendering require support in core
and the CAD renderer.

## Explicit cable models

Set `model` to use a cable specification instead of inferring it from the endpoints.

```tsx
<assembly.cable name="C1" from=".J1" to=".J2"
  model="adaptercable_a(jst_sh_pins4)_b(jst_ph_pins4)" />
```

`standard` retains its existing meaning. Omitting `model` preserves endpoint inference.

## Waypoints

Use ordered waypoints to guide a cable around an obstacle:

```tsx
<assembly.cable
  name="C1"
  from=".J1"
  to=".J2"
  waypointAnchor="start"
  waypointAxisOrientation="board_at_start"
  waypoints={[
    { x: 0, y: 10, z: 5 },
    { x: 20, y: 10, z: 5 },
  ]}
/>
```

`waypointAnchor` makes offsets relative to `from` (`"start"`) or `to` (`"end"`).
`waypointAxisOrientation` independently selects the start or end board orientation
for the axes. Both props are required whenever `waypoints` is defined, including
`[]`. An empty list preserves automatic routing.
