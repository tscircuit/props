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
| `shaftFacingDirection` | `x+`, `x-`, `y+`, `y-`, `z+`, `z-` | Axis and sign preserved; defaults to `z+` |

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
