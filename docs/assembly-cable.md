# Assembly cables

A cable needs more than a start and an end when a holder blocks the direct
route. `waypoints` lets the author say: go around this side, pass through this
clip, then reach the motor.

`AssemblyCableProps` describes those inputs. Its validator is exported as
`assemblyCableProps` and `assemblyProps.cable`.

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

| Prop                      | Accepted input                                                                  | Parsed output                                                     |
| ------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `name`                    | Required nonempty string                                                        | Trimmed cable identity                                            |
| `from`                    | Required nonempty string                                                        | Trimmed start endpoint reference                                  |
| `to`                      | Required nonempty string                                                        | Trimmed end endpoint reference                                    |
| `standard`                | Optional `"usb_c"`                                                              | Unchanged; omitted when not supplied                              |
| `model`                   | Optional nonempty string                                                        | Trimmed explicit cable model specification                        |
| `waypoints`               | Optional array of `{ x: number, y: number, z: number }`; all coordinates finite | Points preserved in the supplied order; omitted when not supplied |
| `waypointAnchor`          | `"start"` or `"end"`; required when `waypoints` is defined                      | Unchanged; no default                                             |
| `waypointAxisOrientation` | `"board_at_start"` or `"board_at_end"`; required when `waypoints` is defined    | Unchanged; no default                                             |

Endpoints can be connector selectors or named assembly references. The initial
`usb_c` preset represents a USB-C-to-USB-C cable. Omitting `standard` leaves
cable selection to endpoint inference. `waypoints` supplies intermediate route
points; endpoint and connector resolution retain their existing behavior.

The schema validates the inputs; endpoint resolution, routing, and rendering
require support in core and the CAD renderer.

## Explicit cable models

Set `model` to use a cable specification instead of inferring it from the endpoints.

```tsx
<assembly.cable
  name="C1"
  from=".J1"
  to=".J2"
  model="adaptercable_a(jst_sh_pins4)_b(jst_ph_pins4)"
/>
```

`standard` retains its existing meaning. Omitting `model` preserves endpoint inference.

## Routing around a gimbal holder

Use `waypoints` to guide a cable past a holder or through cable clips:

```tsx
<assembly.cable
  name="PITCH_CABLE"
  from=".CONTROLLER > .J_PITCH"
  to="PITCH_MOTOR.wireside"
  waypointAnchor="start"
  waypointAxisOrientation="board_at_start"
  waypoints={[
    { x: -35, y: 0, z: 8 },
    { x: -35, y: 45.5, z: 8 },
    { x: -25, y: 45.5, z: 60 },
  ]}
/>
```

The route starts at `from`, passes through each waypoint in order, and ends at
`to`. `waypointAnchor` chooses the reference endpoint for waypoint offsets:
`"start"` uses `from`, and `"end"` uses `to`. `waypointAxisOrientation` selects
the board orientation at the start or end for the waypoint axes. These choices
are independent and have no defaults.

Supply all three coordinates in millimeters as finite numbers; unit strings,
`NaN`, and infinities are rejected. The coordinates above are illustrative;
choose points for the holder dimensions in your assembly.

Whenever `waypoints` is defined, both `waypointAnchor` and
`waypointAxisOrientation` are required, including for `waypoints={[]}`. An empty
array preserves automatic routing. Omitting `waypoints` leaves all three props
optional; the schema does not insert defaults. Existing waypoint inputs must
add both props. There are no aliases or conflicts with `standard` or `model`;
endpoint resolution and cable selection retain their existing behavior.
Waypoints control the displayed route; they do not enforce bend radius or
check collisions with moving parts.
