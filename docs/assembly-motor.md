# Assembly motor props

`assembly.motor` describes a motor model and the direction its shaft faces.
Use a modelprinter string directly; authors do not construct modelcdn URLs.

```tsx
<assembly.motor
  name="MOTOR"
  model="nema17_bodylength38mm_shaftlength24mm_flatdepth0.5mm_flatlength15mm"
  shaftFacingDirection="x+"
/>
```

To point the shaft below the PCB instead:

```tsx
<assembly.motor name="MOTOR" model="nema17" shaftFacingDirection="z-" />
```

## Props

| Prop | Accepted input | Parsed output / default |
| --- | --- | --- |
| `name` | Required, nonblank string | Preserved as the stable assembly identity |
| `displayName` | Optional string | Preserved; omitted by default |
| `model` | Required, nonblank modelprinter string | Surrounding whitespace trimmed; no default motor |
| `shaftFacingDirection` | `x+`, `x-`, `y+`, `y-`, `z+`, `z-` | Axis and sign preserved; defaults to `z+` |

Directions use the right-handed circuit coordinate frame: +X right, +Y top,
+Z above the board. The direction points from the motor body toward the shaft
tip. It is not a position and does not specify roll about the shaft axis.
The default `z+` matches the native shaft direction of the NEMA models.

There are no direction aliases. Invalid directions are rejected rather than
interpreted as a rotation. There are no competing `modelUrl` or `cadModel`
sources on this element; `model` is required. Existing assembly schemas are
unchanged. For a motor previously described with `assembly.subassembly`, use
its modelprinter string as `model` and express the shaft axis with
`shaftFacingDirection` when adopting the motor element in a supporting core.

## Package boundary

This package exports `AssemblyMotorProps`, `AssemblyMotorPropsInput`,
`assemblyMotorProps`, and `assemblyProps.motor`. It defines and validates the
authoring contract. Resolving the model string and rendering/orienting an
`assembly.motor` are responsibilities of `@tscircuit/core` and its consumers;
this props change alone does not add runtime rendering support.
