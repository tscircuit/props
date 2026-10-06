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
| `standard` | Optional `"usb_c"` or `"bullet"` | Unchanged; omitted when not supplied |

Endpoints can be connector selectors or named assembly references. The initial
`usb_c` preset represents a USB-C-to-USB-C cable. Omitting `standard` leaves
cable selection to endpoint inference. Position, orientation, route, and length
are inferred; there are no corresponding props or aliases.

This is an additive props API and requires no migration. The schema validates
the inputs; endpoint resolution, routing, and rendering require support in core
and the CAD renderer.

Bullet connectors use `standard="bullet"`, a required `bulletDiameter` (2, 3,
3.5, 4, 5, 5.5, 6, or 8 mm), and a required `bulletGender="male" | "female"`.
Length strings such as `"3.5mm"` normalize to millimeters. A bullet group has 1–16
contacts; `pinCount` defaults to 1. Set `pinCount={3}` on both endpoint connectors
for three bullet contacts and three insulated wires, emitting `bullet3_d3.5mm_afemale_bmale`. Supply a footprint for each PCB
connector, as for other custom connectors.

```tsx
<connector name="J1" standard="bullet"
  bulletDiameter="3.5mm" bulletGender="male" footprint={bulletFootprint} />
<connector name="J2" standard="bullet"
  bulletDiameter={3.5} bulletGender="female" footprint={bulletFootprint} />
<assembly.cable name="POWER" from=".J1" to=".J2" standard="bullet" />
```

Each cable end has the opposite gender of its selected connector. The example
emits `bullet_d3.5mm_afemale_bmale`. Same-gender PCB endpoints produce a cable
with two ends of the opposite gender. Endpoint diameters and contact counts must match; mismatches
are errors. Omitting the cable's `standard` infers `bullet` from the endpoints.
There are no aliases, and existing USB-C/JST usage requires no migration.
The bullet models represent generic solder contacts rather than a specific
manufacturer's production part.
