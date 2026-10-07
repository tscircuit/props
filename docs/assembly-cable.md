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

Endpoints can be connector selectors or named assembly references. The initial
`usb_c` preset represents a USB-C-to-USB-C cable. Omitting `standard` leaves
cable selection to endpoint inference. Position, orientation, route, and length
are inferred; there are no corresponding props or aliases.

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
