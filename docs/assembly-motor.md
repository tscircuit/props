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
responsibilities of `@tscircuit/core` and its consumers; this props change
alone does not add runtime rendering support.
