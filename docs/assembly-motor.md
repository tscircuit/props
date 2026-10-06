# Assembly motor props

`assembly.motor` describes a motor model and the direction its shaft faces.
Choose `standard="nema8"`, `standard="nema17"`, or `standard="nema23"`;
authors do not construct modelcdn URLs.

```tsx
<assembly.motor name="MOTOR" standard="nema17" shaftFacingDirection="x+" />
<assembly.motor name="MOTOR" standard="nema8" shaftFacingDirection="z-" />
<assembly.motor name="MOTOR" standard="nema23" shaftFacingDirection="z-" />
```

For a custom body or shaft specification, use a modelprinter string instead:

```tsx
<assembly.motor
  name="MOTOR"
  model="nema17_bodylength38mm_shaftlength24mm_flatdepth0.5mm_flatlength15mm"
  shaftFacingDirection="x+"
/>
```

## Mounting a motor to a named face

Use the same face-mating props as `assembly.printedpart`:

```tsx
<assembly.device>
  <assembly.printedpart name="FRAME" jscad={<PrinterFrame />} />
  <assembly.motor
    name="X_MOTOR"
    standard="nema17"
    mountedTo="FRAME.xMotor"
    mountFace="frontface"
    mountGap="0mm"
  />
</assembly.device>
```

`PrinterFrame` defines a named JSCAD reference rectangle `xMotor` at the
attachment point. `mountedTo` names that target; `mountFace` names the face on
the motor. Supply both or neither. At zero gap their origins coincide,
outward normals oppose, and in-plane X directions align. Positive `mountGap`
separates the motor face from the target along the target's outward normal.
The mount determines translation and all three rotation axes, including roll.

For NEMA models, `frontface` is the shaft-side body mounting plane, excluding
the raised pilot and shaft, with origin `[0, 0, 0]` and outward normal `+Z`.
`backface` is the opposite body plane, with origin `[0, 0, -bodyLength]` and
outward normal `-Z`. Both use local `+X` as the in-plane X direction. These
are model-local frames before mounting. A frontface mount points the shaft
opposite the target normal; a backface mount points it along the target normal.
Face mating aligns frames, not bolt holes; the bracket must provide matching
holes and any necessary pilot or shaft clearance.

Omit `shaftFacingDirection` for mounted motors. Providing it together with
`mountedTo` is rejected, even for `"z+"`, rather than introducing competing
orientation constraints. Mounted motors leave the parsed direction unset;
unmounted motors retain the existing `"z+"` default.
Consumers of parsed props must allow an unset direction for mounted motors
and derive it from the resolved face transform.

Mounting references are trimmed strings. `mountedTo` requires `part.face`
syntax, and `mountFace` must be nonblank. The schema accepts custom face names;
core resolves the selected model's faces and reports missing targets/faces,
ambiguous targets, cycles, or incompatible placement constraints. Model
selection rules are unchanged. `mountGap` accepts nonnegative finite mm values
or unit strings and parses to mm; it requires `mountedTo`. Omission stays
`undefined` in parsed props and means zero clearance in core.

There are no mounting aliases. Existing unmounted motors and boards mounted
to a motor need no migration. Adopting motor mounting requires a supporting
core version; this props proposal alone does not implement placement.

## Mounting a board to the motor

`<board>` accepts `mountedTo` and `mountGap`, allowing this assembly:

```tsx
<assembly.device>
  <assembly.motor name="NEMA17" standard="nema17" />

  <Rp2040MotorController mountedTo="NEMA17.backface" mountGap="6mm" />
</assembly.device>
```

The controller component must forward those props to its board:

```tsx
import type { BoardProps } from "@tscircuit/props"

function Rp2040MotorController(
  mounting: Pick<BoardProps, "mountedTo" | "mountGap">,
) {
  return (
    <board width="42.3mm" height="42.3mm" {...mounting}>
      {/* Existing controller components and traces */}
    </board>
  )
}
```

`mountedTo` is an optional nonblank string, trimmed on parse. It names an
assembly mounting face: `NEMA17.backface` refers to the named motor's face
opposite the shaft. Reference resolution is a core responsibility; props
validation preserves the reference without requiring the target to exist yet.

`mountGap` accepts a nonnegative finite number in mm or a distance string such
as `"6mm"`, parsed to mm. It describes the clearance between the mounting face
and the nearest PCB surface. Zero is permitted. Both props are unset by
default; existing boards keep their current placement. A gap only has mounting
meaning when `mountedTo` is supplied. There are no aliases or conflicts with
existing board props. Mounting is board-specific and is not added to groups.

## Props

| Prop | Accepted input | Parsed output / default |
| --- | --- | --- |
| `name` | Required, nonblank string | Preserved as the stable assembly identity |
| `displayName` | Optional string | Preserved; omitted by default |
| `standard` | `nema8`, `nema17`, `nema23`; required when `model` is omitted | Preserved; no default motor standard |
| `model` | Nonblank modelprinter string; required when `standard` is omitted | Surrounding whitespace trimmed; no default model |
| `shaftFacingDirection` | `x+`, `x-`, `y+`, `y-`, `z+`, `z-`; omit when mounted | Defaults to `z+` only when unmounted |
| `mountedTo` | Optional `part.face` string; paired with `mountFace` | Trimmed; unset by default |
| `mountFace` | Optional nonblank motor face name; paired with `mountedTo` | Trimmed; unset by default |
| `mountGap` | Nonnegative finite mm number or distance string; requires `mountedTo` | Parsed to mm; unset means zero clearance |

Directions use the right-handed circuit coordinate frame: +X right, +Y top,
+Z above the board. The direction points from the motor body toward the shaft
tip. It is not a position and does not specify roll about the shaft axis.
The default `z+` matches the native shaft direction of the NEMA models.

There are no direction aliases. Invalid directions are rejected rather than
interpreted as a rotation. There are no competing `modelUrl` or `cadModel`
sources on this element. Exactly one of `standard` and `model` is required;
supplying both is rejected, even if the model describes the same NEMA standard.
Existing assembly schemas are unchanged. For a motor previously described
with `assembly.subassembly`, use
its modelprinter string as `model` and express the shaft axis with
`shaftFacingDirection` when adopting the motor element in a supporting core.

## Package boundary

This package exports `AssemblyMotorStandard`, `AssemblyMotorProps`,
`AssemblyMotorPropsInput`, `assemblyMotorProps`, and `assemblyProps.motor`.
It defines and validates the authoring contract. Resolving the selected
standard or model string and rendering/orienting an `assembly.motor` are
responsibilities of `@tscircuit/core` and its consumers, as is placement of
boards using `mountedTo` and `mountGap`; this props change alone does not add
runtime rendering or mounting support.
